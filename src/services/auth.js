import SecureLS from 'secure-ls';
const ls = new SecureLS({ encodingType: 'aes' });

const getDuration = () => {
  if (sessionStorage.getItem("customer_authentic_pass_duration")) {
    return 'session';
  } else {
    return 'local';
  }
}
export const getAuthName = () => {
  if (getDuration() === 'session') {
    return sessionStorage.getItem("customer_authentic_pass_name");
  } else {
    return ls.get('customer_authentic_pass_name');
  }
};

export const setHistory = (objStr) => {
  localStorage.setItem('customer_authentic_pass_history', objStr);
}

export const getHistory = () => {
  return localStorage.getItem('customer_authentic_pass_history');
}

export const setAuthName = (name) => {
  if (getDuration() === 'session') {
    sessionStorage.setItem("customer_authentic_pass_name", name);
  } else {
    ls.set('customer_authentic_pass_name', name);
  }
}

export const getBarcode = () => {
  return ls.get('customer_authentic_pass_barcode')
};

export const setBarcode = (barcode) => {
  ls.set('customer_authentic_pass_barcode', barcode);
}

export const removeBarcode = () => {
  ls.remove('customer_authentic_pass_barcode')
}


export const getId = () => {
  if (getDuration() === 'session') {
    return sessionStorage.getItem("customer_authentic_pass_id");
  } else {
    return ls.get('customer_authentic_pass_id');
  }
};

export const getAuthUserType = () => {
  if (getDuration() === 'session') {
    return sessionStorage.getItem("customer_authentic_pass_user_type");
  } else {
    return ls.get('customer_authentic_pass_user_type');
  }
};

export const getAuthToken = () => {
  if (getDuration() === 'session') {
    return sessionStorage.getItem("customer_authentic_pass_auth_token");
  } else {
    return ls.get('customer_authentic_pass_auth_token');
  }
};

export const getImage = () => {
  if (getDuration() === 'session') {
    return sessionStorage.getItem("customer_authentic_pass_image");
  } else {
    return ls.get('customer_authentic_pass_image');
  }
};


export const setImage = (image) => {
  if (getDuration() === 'session') {
    sessionStorage.setItem("customer_authentic_pass_image", image);
  } else {
    ls.set('customer_authentic_pass_image', image);
  }
}

export const signOut = () => {
  removeAuthState();
}


export const getAuthUserAll = () => {
  if (getDuration() === 'session') {
    return {
      id: sessionStorage.getItem("customer_authentic_pass_id"),
      name: sessionStorage.getItem("customer_authentic_pass_name"),
      user_type: sessionStorage.getItem("customer_authentic_pass_user_type"),
      auth_token: sessionStorage.getItem("customer_authentic_pass_auth_token")
    }
  } else {
    return {
      id: ls.get("customer_authentic_pass_id"),
      name: ls.get("customer_authentic_pass_name"),
      user_type: ls.get('customer_authentic_pass_user_type'),
      auth_token: ls.get('customer_authentic_pass_auth_token')
    }
  }
}

export const removeAuthState = () => {
  ls.removeAll();
  window.sessionStorage.clear();
  window.localStorage.clear();
};

export const setAuthToken = (token) => {
  if (getDuration() === 'session') {
    sessionStorage.setItem("customer_authentic_pass_auth_token", token);
  } else {
    ls.set('customer_authentic_pass_auth_token', token);
  }
}


export const authenticateUser = (id, name, userType, token, image, duration) => {
  if (duration === 'session') {
    sessionStorage.setItem("customer_authentic_pass_id", id);
    sessionStorage.setItem("customer_authentic_pass_user_type", userType);
    sessionStorage.setItem("customer_authentic_pass_auth_token", token);
    sessionStorage.setItem("customer_authentic_pass_name", name);
    sessionStorage.setItem("customer_authentic_pass_image", image);
    sessionStorage.setItem("customer_authentic_pass_duration", duration);
  } else {
    ls.set("customer_authentic_pass_id", id);
    ls.set('customer_authentic_pass_user_type', userType);
    ls.set('customer_authentic_pass_auth_token', token);
    ls.set('customer_authentic_pass_name', name);
    ls.set('customer_authentic_pass_image', image);
    ls.set('customer_authentic_pass_duration', duration);
  }
};

export const getOrderQty = () => {
  return localStorage.getItem('customer_authentic_pass_orderQty');
};

export const setOrderQty = (orderQty) => {
  localStorage.setItem('customer_authentic_pass_orderQty', orderQty);
}

export const removeOrderQty = (orderQty) => {
  localStorage.setItem('customer_authentic_pass_orderQty', orderQty);
}

export const setHome = (home) => {
  localStorage.setItem('customer_authentic_pass_home', home);
}

export const getHome = () => {
  localStorage.getItem('customer_authentic_pass_home');
}

export default {
  setOrderQty,
  getAuthUserType,
  getAuthToken,
  signOut,
  getImage,
  setImage,
  setHome,
  getHome,
  getId,
  getAuthUserAll,
  setHistory,
  getHistory,
  setAuthToken,
  removeOrderQty,
  setBarcode,
  getBarcode,
  removeBarcode,
  removeAuthState,
  authenticateUser
};


