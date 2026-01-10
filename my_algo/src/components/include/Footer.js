const Footer = () => {
  return (
    <>
      <footer className="footer">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6">
              {new Date().getFullYear()} © <a href="#">{process.env.SITENAME}</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
export default Footer