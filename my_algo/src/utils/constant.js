import { Category } from '@mui/icons-material'

export const apiEndPoint = {
  common: {
    category: '/category-list',
    manageCategory: '/manage-category',
    getUsers: '/get-users',
    getProviders: '/filtered-provider-list',
    updateRoleData: '/update-role-data',
    getSingleProvider: '/get-provider-profile',
    deleteAccount: '/delete-account',
    manageBankDetails: '/manage-bank-details',
    acceptWithdrawRequest: '/accept-withdraw-request'
  },
  provider: {
    updateProviderConfiguration: '/update-provider-configuration',
    addNewProvider: '/add-new-provider',
    verifyProviderOtp: '/verify-provider-otp',
    getLiveCallRevenueHistory: '/get-live-call-revenue-history',
    getChatRevenueHistory: '/get-chat-revenue-history',
    getPostRevenueHistory: '/get-post-revenue-detail',
    getCallRevenueHistory: '/get-call-revenue-history',
    getRevenueSummaryWithInterval: '/get-revenue-summary-with-interval',
    getRevenue: '/get-revenue'
  },
  transectionHistory: {
    getTransectionHistory: '/get-transaction-history'
  },
  withdrawRequests: {
    getWithdrawRequest: '/get-withdraw-request'
  },
  post: {
    getPostList: '/get-post-list',
    updatePost: '/update-post'
  }
}

export const symbole = {
  ruppy: '₹'
}
