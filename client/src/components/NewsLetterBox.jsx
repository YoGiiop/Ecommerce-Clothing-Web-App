import React from "react";

const NewsLetterBox = () => {

    const onSubmitHandler = (e) => {
        e.preventDefault();
        
    }

  return (
    <div className="text-center">
      <p className="text-2xl font-medium text-gray-800">
        Subscribe to our newsletter and get 20% off
      </p>
      <p className="text-gray-400 mt-3">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores,
        quos porro ipsa exercitationem repellat voluptatibus.
      </p>
      <form
        onSubmit={onSubmitHandler}
        className="mx-auto my-6 flex w-full max-w-2xl flex-col items-stretch gap-3 border border-gray-200 px-4 py-4 sm:w-1/2 sm:min-w-[320px] sm:flex-row sm:items-center"
      >
        <input
          type="email"
          className="w-full flex-1 outline-none"
          placeholder="Enter your email"
        />
        <button
          type="submit"
          className="bg-black text-white text-xs px-10 py-4 whitespace-nowrap"
        >
          SUBSCRIBE
        </button>
      </form>
    </div>
  );
};

export default NewsLetterBox;
