import React from 'react'

function SnakeBody({ segments, blockWidth, blockHeight, color }) {
  if (!segments) return null
  return (
    <>
      {segments.map((segment, index) => (
        <div
          key={index}
          className='Block'
          style={{
            width: blockWidth,
            height: blockHeight,
            left: segment.Xpos,
            top: segment.Ypos,
            background: color,
            position: 'absolute',
          }}
        />
      ))}
    </>
  )
}

export default SnakeBody
