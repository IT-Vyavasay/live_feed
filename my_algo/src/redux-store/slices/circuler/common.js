// Third-party Imports
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  loader: {},
  categoryList: [],
  userList: {},
  providersList: {},
  historyList: {},
  transectionHistory: {},
  withdrawRequests: {},
  providerDetails: [],
  postList: {},
  generalData: {},
  revenueSummaryWithIntervalFilter: {
    interval: 'daily'
  },
  revenueSummaryWithInterval: [],
  providerRevenueHistoryFilter: {},
  providerRevenueData: {}
}

export const commonSlice = createSlice({
  name: 'common',
  initialState: initialState,
  reducers: {
    setLoader: (state, action) => {
      state.loader = { ...state.loader, ...(action?.payload ?? {}) }
    },
    setGeneralData: (state, action) => {
      state.generalData = { ...state.generalData, ...(action?.payload ?? {}) }
    },
    addCategory: (state, action) => {
      state.categoryList = action?.payload ?? []
    },
    addUsers: (state, action) => {
      state.userList = action?.payload ?? []
    },
    addProviders: (state, action) => {
      state.providersList = action?.payload ?? []
    },
    updateProviders: (state, action) => {
      state.providersList = {
        ...state.providersList,
        ...(action?.payload ?? {})
      }
    },

    addProviderDetails: (state, action) => {
      state.providerDetails = action?.payload ?? []
    },
    updateProviderDetails: (state, action) => {
      state.providerDetails = action?.payload
    },
    addHistoryList: (state, action) => {
      state.historyList = action?.payload ?? []
    },
    addRevenueSummaryWithInterval: (state, action) => {
      state.revenueSummaryWithInterval = action?.payload ?? []
    },
    addRevenueSummaryWithIntervalFilter: (state, action) => {
      state.revenueSummaryWithIntervalFilter = action?.payload ?? {}
    },
    addTransectionHistory: (state, action) => {
      state.transectionHistory = action?.payload ?? []
    },
    addWithdrawRequests: (state, action) => {
      state.withdrawRequests = action?.payload ?? []
    },
    updateWithdrawRequests: (state, action) => {
      state.withdrawRequests = {
        ...state.withdrawRequests,
        ...(action?.payload ?? {})
      }
    },

    addPostList: (state, action) => {
      state.postList = action?.payload ?? []
    },
    updatePost: (state, action) => {
      state.postList = {
        ...state.postList,
        ...(action?.payload ?? {})
      }
    },
    updateProviderRevenueHistoryFilter: (state, action) => {
      state.providerRevenueHistoryFilter = { ...action.payload } ?? {}
    },
    addProviderRevenueData: (state, action) => {
      state.providerRevenueData = { ...action.payload } ?? {}
    }
  }
})

export const {
  setLoader,
  addCategory,
  addUsers,
  addProviders,
  updateProviders,
  addProviderDetails,
  updateProviderDetails,
  addHistoryList,
  addRevenueSummaryWithInterval,
  addRevenueSummaryWithIntervalFilter,
  addTransectionHistory,
  addWithdrawRequests,
  addPostList,
  updatePost,
  setGeneralData,
  updateWithdrawRequests,
  updateProviderRevenueHistoryFilter,
  addProviderRevenueData
} = commonSlice.actions
export default commonSlice.reducer
