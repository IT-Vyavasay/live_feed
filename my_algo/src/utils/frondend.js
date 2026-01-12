



export async function fetchApi(url, data, method = "POST") {
  try {
    let param = JSON.parse(data)
    let queryString = method === "GET" ? Object.keys(param).map(key => key + '=' + param[key]).join('&') : '';
    let apiUrl = process.env.API_ENDPOINT + url + (queryString ? '?' + queryString : '');
    let resData = await fetch(apiUrl, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: method === "POST" ? JSON.parse(JSON.stringify(data)) : undefined
    })
    return { statusCode: resData.status, data: await resData.json() }
  } catch (e) {
    console.log("fetchApi===>", e)
    return { statusCode: 400, data: { message: 'Internal server error' } }
  }
}

export async function fetchApi_with_upload(url, data, method = "POST") {
  try {
    let apiUrl = process.env.API_ENDPOINT + url
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
    console.log("fetchApi===>", e)
    return { statusCode: 400, data: { message: 'Internal server error' } }
  }
}


export const sortData = (column, sort) => {
  setOrder(sort);
  setOrderClm(column);
  if (sort == 1) {
    $(".fa-sort-down").removeClass("sort-enable");
    $(".fa-sort-up").removeClass("sort-enable");
    $(".fa-sort-up").removeClass("sort-desable");
    $(".fa-sort-down").removeClass("sort-desable");
    $(".asc-" + column).addClass("sort-enable");
  } else {
    $(".fa-sort-down").removeClass("sort-enable");
    $(".fa-sort-up").removeClass("sort-enable");
    $(".desc-" + column).addClass("sort-enable");
  }
};