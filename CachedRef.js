var Firebase = require('firebase');
var _ = require('lodash');
var Promise = require('promise');
var localForage = require('localforage');

function CachedRef(url,options){
  var self = this;

  Firebase.call(this, url);
  this.key = options.key || url;
  this.value = options.value || null;
  this.isReady = false;
  this.isLoaded = false;

  // Load from LocalForage
  this.ready = localForage.getItem(self.key)
    .then(function(str){
        self.isReady = true;
        self.value = JSON.parse(str);
        return self.value;
    });

  // Wait for Firebase
  this.loaded = new Promise(function(resolve,reject){
    self.once('value',function(snapshot) {
      self.isLoaded = true;
      snapshot.fromCache = _.isEqual(self.value,snapshot.val());
      self.value = snapshot.val();
      resolve(self.value);
    });

    setTimeout(function(){
      if(!self.value) {
        console.warn('CachedRef timeout:'+url);
        reject('CachedRef Timeout: '+url);
      }
    },options.timeout || CachedRef.TIMEOUT);
  });

  // Cache on Value!
  this.loaded.then(function(){
    self.on('value',function(snapshot){
      snapshot.fromCache = false;
      self.value = snapshot.val();
      localForage.setItem(self.key,JSON.stringify(self.value));
    });
  });
}

CachedRef.TIMEOUT = 60000;
CachedRef.prototype = Object.create(Firebase.prototype);
CachedRef.prototype.constructor = CachedRef;

// Setting with 0 arguments makes sense,
// it means: update Firebase with data
// currently cached at this.value.
CachedRef.prototype.set = function(value,callback) {
  if(value === undefined) {
    value = this.value;
  }
  Firebase.prototype.set.call(this,value,callback);
};

module.exports = CachedRef;