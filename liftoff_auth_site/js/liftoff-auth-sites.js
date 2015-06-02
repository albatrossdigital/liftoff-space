
(function($, Drupal) {
  Drupal.behaviors.liftoff_auth_sites = {
    attach: function(context, settings) {
      
      if (settings.liftoff_auth_site != undefined) {
        angular.bootstrap(context, ['siteApp']);
      }
    }
  };
})(jQuery, Drupal);
