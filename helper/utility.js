const uuidv1 = require('uuid/v1');

let utility = {
  /**
   * @func			{generateUniqueId}
   * @returns		{!string}		    {Returns a unique identifier based on proccessor timestamp}
   */
  generateUniqueId: () => uuidv1(),

  /**
   * @func			{generateQueryString}
   * @param  		{*} 		        data 	{Input dictionary data to manuipulate}
   * @returns		{!string}		    {query string data form}
   */
  generateQueryString: data => {
    let ret = [];
    for (let d in data) {
      if (data[d]) {
        ret.push(encodeURIComponent(d) +
          '=' + encodeURIComponent(data[d]));
      }
    }
    return ret.join('&');
  },

  /**
   * @func			{base64Encoding}
   * @param  		{*} 		        data 	{Input data to encode}
   * @returns		{!string}		    {Encodes data with Base64 encription algorithm}
   */
  base64Encoding: data => new Buffer(data).toString('base64'),

  /**
   * @func			{base64Decoding}
   * @param  		{!string} 		  data 	{Input data to decode}
   * @returns		{*}		          {Decodes data with Base64 decription algorithm}
   */
  base64Decoding: data => new Buffer(data, 'base64'),

  /**
   * @func			{getUnixTimeStamp}
   * @returns		{!number}		     {Returns current unix timestamp in milliseconds}
   */
  getUnixTimeStamp: () => Date.now(),

  /**
   * @func			{stringReplace}
   * @param  		{!string} 		  source 	  {Source string to do replacement on}
   * @param  		{!string} 		  find 	    {String which should be replaced}
   * @param  		{!string} 		  replace 	{New string to become replaced on}
   * @returns		{!string}		    {Returns replacement of a string with another}
   */
  stringReplace: (source, find, replace) => source.replace(find, replace),

  /**
   * @func			{generateRandomString}
   * @param  		{!string} 		  length    {Length of output string}
   * @returns		{!string}		    {Returns a random string with provided length}
   */
  generateRandomString: length => {
    if (!utility.checkIfVariableIsNumber(length)) {
      return new Error('Length is not number.');
    }
    let text = '';
    let possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
      text += possible.charAt(
        Math.floor(Math.random() * possible.length)
      );
    }
    return text;
  },

  /**
   * @func			{generateRandomPersianString}
   * @param  		{!string} 		  length    {Length of output string}
   * @returns		{!string}		    {Returns a random string with provided length}
   */
  generateRandomPersianString: length => {
    if (!utility.checkIfVariableIsNumber(length)) {
      return new Error('Length is not number.');
    }
    let text = '';
    let possible =
      'ابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی';
    for (let i = 0; i < length; i++) {
      text += possible.charAt(
        Math.floor(Math.random() * possible.length)
      );
    }
    return text;
  },

  /**
   * @func			{generateRandomNumber}
   * @param  		{!number} 		  min       {Minimum number to be GTE in output number}
   * @param  		{!number} 		  max       {Maximum number to be LTE in output number}
   * @returns		{!number}		    {Returns a random number between provided min and max numbers}
   */
  generateRandomNumber: (min, max) => {
    if (!utility.checkIfVariableIsNumber(min)) {
      return new Error('Min is not number.');
    }
    if (!utility.checkIfVariableIsNumber(max)) {
      return new Error('Max is not number.');
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  /**
   * @func			{checkIfVariableIsError}
   * @param  		{*} 		        variable  {Variable to become checked}
   * @returns		{!boolean}		  {Checks if variable is instance of Error}
   */
  checkIfVariableIsError: variable => variable instanceof Error,

  /**
   * @func			{checkIfVariableIsBoolean}
   * @param  		{*} 		        variable  {Variable to become checked}
   * @returns		{!boolean}		  {Checks if variable is instance of Boolean}
   */
  checkIfVariableIsBoolean: variable => typeof variable === 'boolean',

  /**
   * @func			{checkIfVariableIsNumber}
   * @param  		{*} 		        variable  {Variable to become checked}
   * @returns		{!boolean}		  {Checks if variable is instance of Number}
   */
  checkIfVariableIsNumber: variable => !isNaN(variable),

  /**
   * @func			{wrapper}
   * @param  		{*} 		        function  {function to become wrapped}
   * @returns		{!function}		  {wrappes a function into try/catch block}
   */
  wrapper: func => async (...args) => {
    try {
      return await func(...args);
    } catch (e) {
      throw e;
    }
  },

  /**
   * @func			{wrapperWithCallback}
   * @param  		{*} 		        function  {function to become wrapped}
   * @returns		{!function}		  {wrappes a function into try/catch block}
   */
  wrapperWithCallback: func => async (...args) => {
    try {
      return await func(...args);
    } catch (e) {
      args.slice(-1)(e);
    }
  },

  /**
   * @func			{whiteChecker}
   * @param  		{*} 		        reqInput  {data input to check white list on}
   * @param  		{*} 		        whiteList {the list of properties to become checked in reqInput}
   * @returns		{!boolean}		  {Checks provided keys in reqInput are in whiteList or not}
   */
  whiteChecker(reqInput, whiteList) {
    let keys = Object.keys(reqInput);
    for (let key of keys) {
      if (!whiteList.includes(key)) {
        return false;
      }
    }
    return true;
  },

  /**
   * @func			{requiredChecker}
   * @param  		{*} 		        reqInput  {data input to check white list on}
   * @param  		{*} 		        requiredList {the list of required properties to become checked in reqInput}
   * @returns		{!boolean}		  {Checks if the provided required keys are included in reqInput or not}
   */
  requiredChecker(reqInput, requiredList) {
    for (let required of requiredList) {
      if (typeof reqInput[required] === 'undefined') {
        return false;
      }
    }
    return true;
  },

  /**
   * @func			{getIpAddress}
   * @param  		{*} 		        request  {request object to server}
   * @returns		{!string}		  	{returns the ip address srting from request}
   */
  getIpAddress(req) {
    let ipAddress;
    // The request may be forwarded from local web server.
    let forwardedIpsStr = req.header('x-forwarded-for');
    if (forwardedIpsStr) {
      // 'x-forwarded-for' header may return multiple IP addresses in
      // the format: "client IP, proxy 1 IP, proxy 2 IP" so take the
      // the first one
      let forwardedIps = forwardedIpsStr.split(',');
      ipAddress = forwardedIps[0];
    }
    // If request was not forwarded
    if (!ipAddress) {
      ipAddress = req.connection.remoteAddress;
    }
    return ipAddress;
  }
};

module.exports = utility;
