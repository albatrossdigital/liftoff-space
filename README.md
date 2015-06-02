Liftoff-space
=============

Restful api for Aegir site spin ups.


###Architecture
* o1.liftoff.space: D6 Aegir (barricuda currently) - hosting provisioning
  * liftoff_api module installed from `./liftoff_api`
    * Provides rest api to interact with aegir
    * Adds sets site variables, creates new user+role+bakery when site is created/cloned
    * `@todo` talk to auth.liftoff.space when site installation/migration complete
  * provision_site_add_user drush module installed from `./provision_site_add_user`
    * Creates aegir tasks to add user to group, run vset on site provision

* auth.liftoff.space: D7 with Site content type, stores user data ("CRM")
  * liftoff_auth_site module installed from `./liftoff_auth_site`
    * Creates rest api for 3rd party sites to communicate with
    * AngularJS app for quickly managing sites
    * `@todo` save leads in Pipedrive, etc
    * `@todo` receive ping from o1.liftoff.space, update node status, send email 
  * Bakery suite enabled and configured
    * Authoritative auth server

* 3rd party site (http://helmcivic.com/new)
  * Spins up sites by talking to auth.liftoff.space rest api
  * Manages sites via restws


### Other Setup Steps

#####/data/conf/global.inc

1. ln 273: `$is_dev = TRUE;`

2. Bottom of file
```
/**
 * Liftoff/Helm-specific code
 */
$conf['bakery_master'] = 'http://auth.liftoff.space/';
$conf['bakery_freshness'] = '604800';   // cookie lifetime = 1 wk
$conf['bakery_key'] = 'IzDMLQmzrSvXs8S495tdunqx';
$conf['bakery_domain'] = '.liftoff.space';
$conf['bakery_supported_fields'] = array(
  'name' => 'name',
  'mail' => 'mail',
  'picture' => 'picture',
  'status' => 'status',
);

$conf['angular_media_flickrKey'] = '0a4705b25c964f6e42e00c5a02f5ff16';

$conf['preprocess_js'] = 0;
$GLOBALS['conf']['preprocess_js'] = 0;
```
