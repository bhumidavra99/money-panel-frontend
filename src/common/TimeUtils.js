import moment from "moment-timezone";

export const convertIstToUtc = (istDate) => {
  const utcDate = moment
    .tz(istDate, "Asia/Kolkata") 
    .utc()
    .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"); 
  
  return utcDate;
};

export const convertUtcToIst = (utcDate) => {
  const istDate = moment
    .utc(utcDate) 
    .tz("Asia/Kolkata") 
    .format("YYYY-MM-DD HH:mm:ss"); 
  return istDate;
};

export const convertUtcToIstDateOnly = (utcDate) => {
  const istDate = moment
    .utc(utcDate)              
    .tz("Asia/Kolkata") 
    .format("DD-MM-YYYY");  

  return istDate;
};
