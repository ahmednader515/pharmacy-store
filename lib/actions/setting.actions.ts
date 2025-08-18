'use server'
import { ISettingInput } from '@/types'
import data from '../data'
import { connectToDatabase } from '../db'
import { formatError } from '../utils'
import { cookies } from 'next/headers'

const globalForSettings = global as unknown as {
  cachedSettings: ISettingInput | null
}
export const getNoCachedSetting = async (): Promise<ISettingInput> => {
  const connection = await connectToDatabase()
  if (connection.isMock) {
    return data.settings[0]
  }
  const setting = await connection.prisma.setting.findFirst()
  return JSON.parse(JSON.stringify(setting)) as ISettingInput
}

export const getSetting = async (): Promise<ISettingInput> => {
  if (!globalForSettings.cachedSettings) {
    console.log('hit db')
    const connection = await connectToDatabase()
    if (connection.isMock) {
      globalForSettings.cachedSettings = data.settings[0]
    } else {
      const setting = await connection.prisma.setting.findFirst()
      globalForSettings.cachedSettings = setting
        ? JSON.parse(JSON.stringify(setting))
        : data.settings[0]
    }
  }
  return globalForSettings.cachedSettings as ISettingInput
}

export const updateSetting = async (newSetting: ISettingInput) => {
  try {
    const connection = await connectToDatabase()
    
    if (connection.isMock) {
      return { success: false, message: 'Cannot update settings in mock mode' }
    }
    
    const existingSetting = await connection.prisma.setting.findFirst()
    let updatedSetting
    
    if (existingSetting) {
      updatedSetting = await connection.prisma.setting.update({
        where: { id: existingSetting.id },
        data: newSetting
      })
    } else {
      updatedSetting = await connection.prisma.setting.create({
        data: newSetting
      })
    }
    
    globalForSettings.cachedSettings = JSON.parse(
      JSON.stringify(updatedSetting)
    ) // Update the cache
    return {
      success: true,
      message: 'Setting updated successfully',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

// Server action to update the currency cookie
export const setCurrencyOnServer = async (newCurrency: string) => {
  'use server'
  const cookiesStore = await cookies()
  cookiesStore.set('currency', newCurrency)

  return {
    success: true,
    message: 'Currency updated successfully',
  }
}
