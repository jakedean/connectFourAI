// All credit to Anthony Nardi
// git@github.com:anthony-nardi/Extends.git

if (!Object.prototype.extend) {

  Object.prototype.extend = function (object) {

    for (key in object) {

      if (typeof object[key] === 'object' 
         && typeof this[key] === 'object'
         && this.hasOwnProperty(key)) {
        
        this[key].extend(object[key]);

      } else {
        this[key] = object[key];
      }
    }
    return this;
  };
};


if (!Array.prototype.arrayExtend) {
    
  Array.prototype.arrayExtend = function (object) {

    for (key in object) {

      if (typeof object[key] === 'object' 
         && typeof this[key] === 'object'
         && this.hasOwnProperty(key)) {

        this[key].arrayExtend(object[key]);      
      
      } else {    
        if (object[key] instanceof Array) {
          this[key] = object[key].slice(0);
        } else {
          this[key] = object[key];      
        }
      }
    }    
    return this;  
  };
};