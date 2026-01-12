import React, { use } from 'react'
import CurrentOrderList from '../../../../../components/pageComponent/currentOrderList/CurrentOrderList'

const page = async ({ params }) => {
    const { listType } = await params

    return <CurrentOrderList listType={listType} />
}

export default page