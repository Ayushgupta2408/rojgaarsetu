//# Assignment :: Need error in both eng and hindi for each error code as of now only eng working
const ErrorMessage = ({ error}) => {

  return (
    <div className="text-center text-red-600 py-10">
      <p>{error}</p>
    </div>
  )
}

export default ErrorMessage
