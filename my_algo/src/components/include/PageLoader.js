
'use client'
import { useAuthContext } from "../../context/auth"

export default function PageLoader(props) {
  const { pageLoader } = useAuthContext()
  return (
    <>
      <div className='pre-loader' style={{ display: (pageLoader == false ? 'none' : '') }}>
        <div className="loading">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div id="main-wrapper" className={pageLoader == false ? 'show' : ''}>
        {props.children}
      </div>
    </>
  )
}