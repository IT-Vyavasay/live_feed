import { apiEndPoint } from './constant'
import { fetchApi } from './frontend'

export const getCategory = async () =>
  await fetchApi({
    url: apiEndPoint.common.category,
    method: 'GET',
    errorMessage: 'Failed to load category, plz try again',
    defaultResponse: []
  })

export const manageCategory = async ({
  data,
  successMessage,
  errorMessage = 'Failed to manage category, plz try again',
  successAction
}) =>
  await fetchApi({
    url: apiEndPoint.common.manageCategory,
    method: 'POST',
    data,
    errorMessage,
    successMessage,
    defaultResponse: [],
    successAction
  })

export const getUsers = async data =>
  await fetchApi({
    url: apiEndPoint.common.getUsers,
    method: 'GET',
    errorMessage: 'Failed to load user list, plz reload page',
    defaultResponse: [],
    data: JSON.stringify(data)
  })

export const getProviders = async data =>
  await fetchApi({
    url: apiEndPoint.common.getProviders,
    method: 'GET',
    errorMessage: 'Failed to load providers list, plz reload page',
    defaultResponse: [],
    data: JSON.stringify(data)
  })

export const updateRoleData = async data => {
  const response = await fetchApi({
    url: apiEndPoint.common.updateRoleData,
    method: 'POST',
    errorMessage: 'Failed to update role, plz try again',
    defaultResponse: [],
    successMessage: { type: 'success', text: data?.successMessage },
    errorMessage: data?.errorMessage,
    data: JSON.stringify(data)
  })

  return response
}

export const getSingleProvider = async data =>
  await fetchApi({
    url: apiEndPoint.common.getSingleProvider,
    method: 'GET',
    errorMessage: 'Failed to load provider`s details, plz reload page',
    defaultResponse: [],
    data: JSON.stringify(data)
  })

export const updateProviderConfiguration = async data =>
  await fetchApi({
    url: apiEndPoint.provider.updateProviderConfiguration,
    method: 'POST',
    errorMessage: 'Failed to update provider`s configuration, plz try again',
    successMessage: { text: 'Configuration updated successfully', type: 'success' },
    defaultResponse: [],
    data: JSON.stringify(data)
  })

export const addNewProvider = async data =>
  await fetchApi({
    url: apiEndPoint.provider.addNewProvider,
    method: 'POST',
    errorMessage: `Failed to ${!data.providerId ? 'add' : 'update'} provider, plz try again`,
    successMessage: { text: `Provider ${!data.providerId ? 'add' : 'update'} successfully`, type: 'success' },
    defaultResponse: [],
    data: JSON.stringify(data)
  })

export const verifyProviderOtp = async data =>
  await fetchApi({
    url: apiEndPoint.provider.verifyProviderOtp,
    method: 'POST',
    errorMessage: 'Failed to verufy otp, plz try again',
    successMessage: { text: `Provider verified successfully`, type: 'success' },
    defaultResponse: [],
    data: JSON.stringify(data)
  })

export const deleteAccount = async data =>
  await fetchApi({
    url: apiEndPoint.common.deleteAccount,
    method: 'DELETE',
    errorMessage: 'Failed to verufy otp, plz try again',
    successMessage: { text: `Provider verified successfully`, type: 'success' },
    defaultResponse: [],
    data: JSON.stringify(data)
  })

export const getHistory = async ({ data, hitoryType }) => {
  let endPoint = ''

  switch (hitoryType) {
    case 'Live Call':
      endPoint = 'getLiveCallRevenueHistory'
      break
    case 'Video Call':
      endPoint = 'getCallRevenueHistory'
      break
    case 'Voice Call':
      endPoint = 'getCallRevenueHistory'
      break
    case 'Chat':
      endPoint = 'getChatRevenueHistory'
      break
    case 'Post':
      endPoint = 'getPostRevenueHistory'
      break
    default:
      endPoint = 'getLiveCallRevenueHistory'
      break
  }
  const response = await fetchApi({
    url: apiEndPoint.provider[endPoint],
    method: 'GET',
    errorMessage: 'Failed to load live call revenue history, plz reload page',
    defaultResponse: [],
    data: JSON.stringify(data)
  })
  return response
}

export const getRevenueSummaryWithInterval = async data =>
  await fetchApi({
    url: apiEndPoint.provider.getRevenueSummaryWithInterval,
    method: 'GET',
    errorMessage: 'Failed to load providers list, plz reload page',
    defaultResponse: [],
    data: JSON.stringify(data)
  })

export const getTransectionHistory = async data =>
  await fetchApi({
    url: apiEndPoint.transectionHistory.getTransectionHistory,
    method: 'GET',
    errorMessage: 'Failed to load transection History, plz reload page',
    defaultResponse: [],
    data: JSON.stringify(data)
  })

export const getWithdrawRequests = async data =>
  await fetchApi({
    url: apiEndPoint.withdrawRequests.getWithdrawRequest,
    method: 'GET',
    errorMessage: 'Failed to load withdraw requests list, plz reload page',
    defaultResponse: [],
    data: JSON.stringify(data)
  })
export const getposts = async data =>
  await fetchApi({
    url: apiEndPoint.post.getPostList,
    method: 'GET',
    errorMessage: 'Failed to load post list, plz reload page',
    defaultResponse: [],
    data: JSON.stringify(data)
  })

export const updatePostData = async data =>
  await fetchApi({
    url: apiEndPoint.post.updatePost,
    method: 'POST',
    errorMessage: 'Failed to update post, plz try again',
    successMessage: { text: `Post updated successfully`, type: 'success' },
    defaultResponse: [],
    data: JSON.stringify(data)
  })

export const manageBankDetails = async data =>
  await fetchApi({
    url: apiEndPoint.common.manageBankDetails,
    method: 'POST',
    errorMessage: `Failed to manage Bank Details, plz try again`,
    successMessage: { text: `Bank details updated successfully`, type: 'success' },
    defaultResponse: [],
    data: JSON.stringify(data)
  })

export const acceptWithdrawRequest = async data =>
  await fetchApi({
    url: apiEndPoint.common.acceptWithdrawRequest,
    method: 'POST',
    errorMessage: `Failed to accept withdraw requate , plz try again`,
    successMessage: { text: ` Withdraw requated accepted successfully`, type: 'success' },
    defaultResponse: [],
    data: JSON.stringify(data)
  })

export const getProviderRevenueSummary = async data =>
  await fetchApi({
    url: apiEndPoint.provider.getRevenue,
    method: 'GET',
    errorMessage: 'Failed to load post list, plz reload page',
    defaultResponse: [],
    data: JSON.stringify(data)
  })
