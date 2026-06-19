import React from 'react'

function Card({name,desc,btntxt,img}) {
  return (
        <div className="p-4 rounded shadow hover:shadow-md transition flex flex-col justify-between">
              <div>
                <img src={img} alt="img" className="rounded mb-4 w-full h-70 object-cover" />
                <h3 className="font-semibold mb-2">{name}</h3>
                <p className="text-sm text-gray-600">{desc}</p>
              </div>
              <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">{btntxt}</button>
            </div>
  )
}

export default Card
