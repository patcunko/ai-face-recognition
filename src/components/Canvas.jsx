import { forwardRef } from 'react';

const Canvas = forwardRef(function Canvas(_, ref) {
  return <canvas ref={ref} id="output" />;
});

export default Canvas;
