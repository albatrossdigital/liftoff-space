Other aegir customizations:


### /data/conf/global.inc

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


3. Custom provison tasks are added in:
/data/disk/o1/.drush/xts/provision_site_add_user