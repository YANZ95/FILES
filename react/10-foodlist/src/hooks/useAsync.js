import { useState } from "react";

function useAsync(asyncFunction) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);
}

const wrappedFunction = async (...args) => {
  try {
    setError(null);
    setPending(true);
    await asyncFunction(...args);
  } catch (error) {
    setError(error);
    return;
  } finally {
    setPending(false);
  }
};

return [pending, error, wrappedFunction];
// 배열 형태로 구조분해해서 받는다. 배열로 받음

export default useAsync;
