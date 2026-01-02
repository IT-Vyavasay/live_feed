const API_ENDPOINT = 'https://circuler-backend.onrender.com'
const AUTH_TOKEN = `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJtb2JpbGUiOiI3Njk4NDIxMjgxIiwicm9sZSI6IjEiLCJpYXQiOjE3NTQ4NTQxNTJ9.lY8O5WA0kBe_Bu9MjSTcJO7JxRgh8afTgelIHA458gamLa8WRMWn11XXW1eKBaUiscsvQKRaVXiWziihpGZL_EFFa1aG0d89-jD8Pdoo5VxdKtp8y37Qcx_A1oI3QmIAT7BGoG0iWV5exL43cgr1BuX1fNbNURFTAYpQIsFfo-qwMEe85JDyGKmyfj0TjuVS-v9Ek7JWl-MVQ_JyxB1rbmloMwQYKp_KPBtBHHUV9ZHn0jhwmUNfhCWVSr9mgcenc8aXI4wOfV-dMxvrKS2r2t-7E9Hm9wiD02_TMELXStkRMnL8luqiVVc7XAbFRlBOEEDJBM89fLYg71jDbmFdgYtacy0EMtfTVZ_7aLgL0WKRZ--kV3PsT2Dc4nrRH3trG0biRS33LxICbObgB_nKnGX4EfoBbB_A78O1gg9p5QFmsXHRdSgWD5WktptJp91YU-iP7mijYl600zzeF04uNrBQ7NwYCKMfqVspbF_jIRra0_7gP-cYnzGPI0j-E9tW4Rl1yEn17s8nZz7ILHFuXbooTf5pnECbqIMu7IEyCklLru8BD2N6rABw6Sl4CIrE6rHZv2_zvbarJ2cL5Gu3Ck4exN3BIr1fs-vqOjPYuNCf92vayXCabxLMxmb90nCc3OXEHQuTNXpmv4kcI4JiegIci7cmccFPcHtW3MisEoU`
import { toast } from 'react-toastify'
import { fetchError } from './common'
export async function fetchApi({
  url,
  data = JSON.stringify({ a: 1 }),
  method = 'POST',
  errorMessage,
  successMessage,
  defaultResponse,
  successAction,
  errorMessagePriority = 'api'
}) {
  try {
    let param = JSON.parse(data)

    let queryString =
      method === 'GET'
        ? Object.keys(param)
            .map(key => key + '=' + param[key])
            .join('&')
        : ''
    let apiUrl = API_ENDPOINT + url + (queryString ? '?' + queryString : '')
    let resData = await fetch(apiUrl, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`
      },
      body: ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) ? data : undefined
    })
    const responseData = await resData.json()

    if (responseData.status < 200 || responseData.status >= 300) {
      throw fetchError({ error: responseData })
    }

    if (successMessage) {
      toast[successMessage?.type == 'error' ? 'error' : 'success'](successMessage?.text)
    }
    if (successAction) {
      successAction()
    }
    return { statusCode: resData.status, data: responseData }
  } catch (e) {
    const isApiErrorPriority = errorMessagePriority == 'api'
    const errorMsg = fetchError({ error: e, ...(isApiErrorPriority ? {} : { defaultMessage: errorMessage }) })
    toast.error(errorMsg)
    console.log({ errorMsg })
    console.error(`Error: ${url}`, e)
    return { statusCode: 400, data: { message: errorMsg, data: defaultResponse } }
  }
}

export async function fetchApi_with_upload(url, data, method = 'POST') {
  try {
    let apiUrl = API_ENDPOINT + url
    const headers = new Headers()
    let reqdata = {
      credentials: 'include',
      method: method,
      headers: headers,
      body: data
    }
    let resData = await fetch(apiUrl, reqdata)
    return { statusCode: resData.status, data: await resData.json() }
  } catch (e) {
    console.log('fetchApi===>', e)

    return { statusCode: 400, data: { message: 'Internal server error' } }
  }
}
