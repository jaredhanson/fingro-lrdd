var lrdd = require('webfinger').lrdd;
var NoDataError = require('./errors/nodataerror');

module.exports = function() {
  
  var plugin = {};
  
  plugin.resolveAliases = function(identifier, cb) {
    lrdd(identifier, {}, function(err, jrd) {
      if (err) {
        // Ignore the error under the assumption that Webfinger is not
        // implemented by the host.  The expectation is that other discovery
        // mechanisms are registered with `fingro` that will be used as
        // alternatives.
        return cb(null);
      }
      if (!jrd.aliases || jrd.aliases.length == 0) {
        return cb(new NoDataError('No aliases in XRD'));
      }
      
      return cb(null, jrd.aliases);
    });
  }
  
  plugin.resolveProperties = function(identifier, cb) {
    lrdd(identifier, {}, function(err, jrd) {
      if (err) {
        // Ignore the error under the assumption that Webfinger is not
        // implemented by the host.  The expectation is that other discovery
        // mechanisms are registered with `fingro` that will be used as
        // alternatives.
        return cb(null);
      }
      if (!jrd.properties || jrd.properties.length == 0) {
        return cb(new NoDataError('No properties in XRD'));
      }
      
      return cb(null, jrd.properties);
    });
  }
  
  plugin.resolveServices = function(identifier, type, cb) {
    if (typeof type == 'function') {
      cb = type;
      type = undefined;
    }
    
    lrdd(identifier, {}, function(err, jrd) {
      if (err) {
        // Ignore the error under the assumption that Webfinger is not
        // implemented by the host.  The expectation is that other discovery
        // mechanisms are registered with `fingro` that will be used as
        // alternatives.
        return cb(null);
      }
      if (!jrd.links || jrd.links.length == 0) {
        return cb(new NoDataError('No links in XRD'));
      }
      
      var services = {}
        , links = jrd.links
        , link, i, len;
      for (i = 0, len = links.length; i < len; ++i) {
        link = links[i];
        services[link.rel] = (services[link.rel] || []).concat({
          location: link.href,
          type: link.type
        });
      }
      
      return cb(null, services);
    });
  }
  
  return plugin;
}