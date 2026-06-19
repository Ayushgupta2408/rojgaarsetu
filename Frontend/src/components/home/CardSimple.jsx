import React from 'react'

function CardSimple({icon,name,desc,bg}) {
  return (
    <div className="p-4 py-10 rounded shadow hover:shadow-md transition bg-white ">
          {React.createElement(icon, { className: "mx-auto text-blue-600 mb-4", size: 36 })}
          <h3 className="font-semibold text-lg mb-2">{name}</h3>
          <p className="text-md text-gray-600">{desc}</p>
        </div>
  )
}

export default CardSimple
