/**
 * Created by Sergio on 11/12/2016.
 */
var q = require('q');

module.exports = function(credentials){
    var unitOfWork = require('../libs/unitOfWork.js')(credentials);

    var getUserMenu = function(params){
        var deferred = q.defer();
        unitOfWork.menuRepository.getUserMenu(params).then(function(res) {
            var menuPrincipal = getMenuPrincipal(res);
            var treeMenu = createTreeMenu(res, menuPrincipal);
            deferred.resolve(treeMenu);
        }, function (err) {
            deferred.reject(err);
        })
        return deferred.promise;
    }

    function getMenuPrincipal(menu){
        var menuPrincipal = [];
        menu.forEach(function(opcion){
            if(opcion.opcion_padre == null){
                menuPrincipal.push(opcion)
            }
        });
        menuPrincipal = menuPrincipal.sort(function (a, b) {
            return (a.posicion - b.posicion)
        })
        return menuPrincipal;
    }

    function createTreeMenu(menu, principal){
        var treeMenu = [];
        principal.forEach(function(opcion){
            var children = findChildren(opcion, menu)
            if(children.length > 0){
                opcion['submenu'] = children;
                createTreeMenu(menu, children)
            }
            treeMenu.push(opcion)
        });
        return treeMenu;
    }

    function findChildren(opcion, menu){
        var children = [];
        menu.forEach(function(subopcion){
            if(opcion.menu_opcion_id == subopcion.opcion_padre){
                children.push(subopcion)
            }
        });
        children = children.sort(function (a, b) {
            return (a.posicion - b.posicion)
        })
        return children;
    }

    return {
        getUserMenu: getUserMenu,
    }
};