const initialState = {
  mangNguoiDung: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "SUBMIT":
      return {
        ...state,
        mangNguoiDung: [...state.mangNguoiDung, action.nguoiDung],
      };

    default:
      return state;
  }
};
