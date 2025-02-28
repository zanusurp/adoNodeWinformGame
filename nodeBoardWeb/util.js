var util = {};

util.parseError = function(errors){ //글 작성, 가입 등 에러 처리 
  var parsed = {};
  if(errors.name == 'ValidationError'){
    for(var name in errors.errors){
      var validationError = errors.errors[name];
      parsed[name] = { message:validationError.message };
    }
  } 
  else if(errors.code == '11000' && errors.errmsg.indexOf('username') > 0) {
    parsed.username = { message:'This username already exists!' };
  } 
  else {
    parsed.unhandled = JSON.stringify(errors);
  }
  return parsed;
}

//로그인 처리
util.isLoggedin = function(req, res, next){
    if(req.isAuthenticated()){
      next();
    } 
    else {
      req.flash('errors', {login:'Please login first'});
      res.redirect('/login');
    }
  }
  
  util.noPermission = function(req, res){
    req.flash('errors', {login:"You don't have permission"});
    req.logout();
    res.redirect('/login');
  }

  util.getPostQueryString = function(req,res,next){
    res.locals.getPostQueryString = function(isAppended=false, overwrites={}){
      var queryString = '';
      var queryArray = [];
      var page = overwrites.page?overwrites.page:(req.query.page?req.query.page:'');
      var limit = overwrites.limit?overwrites.limit:(req.query.limit?req.query.limit:'');
      //게시글 찾는 기능 추가
      var searchType = overwrites.searchType?overwrites.searchType:(req.query.searchType?req.query.searchType:'');
      var searchText = overwrites.searchType?overwrites.searchType:(req.query.searchText?req.query.searchText:'');

      if(page) queryArray.push('page='+page);
      if(limit) queryArray.push('limit='+limit);
      if(searchType) queryArray.push('searchType='+searchType);
      if(searchText) queryArray.push('searchText='+searchText);

      if(queryArray.length>0) queryString = (isAppended?'&':'?') + queryArray.join('&');
      return queryString;
    }
    next();
  }

util.convertToTrees = function(array, idFieldName, parentIdFieldName, childrenFieldName){
  var cloned = array.slice();
  for(var i =cloned.length-1; i>-1;i--){
    var parentId = cloned[i][parentIdFieldName];

    if(parentId){
      var filtered = array.filter(function(elem){
        return elem[idFieldName].toString() == parentId.toString();
      });
      if(filtered.length){
        var parent = filtered[0];
        if(parent[childrenFieldName]){
          parent[childrenFieldName].push(cloned[i]);
        }
        else{
          parent[childrenFieldName] = [cloned[i]];
        }
      }
      cloned.splice(i,1);
    }
  }
  return cloned;
}
//용량 
util.bytesToSize = function(bytes) {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return '0 Byte';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}
module.exports = util;