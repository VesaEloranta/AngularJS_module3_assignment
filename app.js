(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.directive('foundItems', FoundItemsDirective)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");

function FoundItemsDirective() {
  var ddo = {
    templateUrl: 'foundList.html',
    scope: {
      found: '<',
      myTitle: '@title',
      onRemove: '&'
    }
  };
  return ddo;
}


NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var list = this;
  list.title = ""

  list.getItems = function (searchTerm) {
    searchTerm = searchTerm.toLowerCase();
    list.title = "Found items"
    var promise = MenuSearchService.getMatchedMenuItems(searchTerm);
    promise.then(function (response) {
      list.found = response;
    })
  }

  list.removeItem = function (itemIndex) {
    list.found.splice(itemIndex, 1);
  };

}

 MenuSearchService.$inject = ['$http', 'ApiBasePath'];
 function MenuSearchService($http, ApiBasePath) {
   var service = this;

   service.getMatchedMenuItems = function (searchTerm) {
     return $http({
         method: "GET",
         url: (ApiBasePath + "/menu_items.json")
       }).then(function (result) {
         // process result and only keep items that match
         var foundItems = [];
         var items = result.data.menu_items;
         items.forEach(function(item){

           if (item.description.toLowerCase().includes(searchTerm)){
             foundItems.push(item);
           };
         })
         // return processed items
         return foundItems;
     });
   };
 };


})();
