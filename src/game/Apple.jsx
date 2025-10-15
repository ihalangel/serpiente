import React from 'react'

function Apple({ Xpos, Ypos, blockWidth, blockHeight, color }) {
  return (
    <div
      className='Block'
      style={{
        width: blockWidth,
        height: blockHeight,
        left: Xpos,
        top: Ypos,
        background: color,
        position: 'absolute',
      }}
    />
  )
}

export default Apple
