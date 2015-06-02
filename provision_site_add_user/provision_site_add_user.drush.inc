<?php

/**
 * @file
 * Provision/Drush hooks for the provision-export_backup command.
 *
 * These are the hooks that will be executed by the drush_invoke function
 * when asking for an export backup command
 */

/**
 * Implements hook_drush_command().
 */
function provision_site_add_user_drush_command() {
  $items['provision-add_user'] = array(
    'description' => 'Add a user to a site and give them a role.',
    'bootstrap' => DRUSH_BOOTSTRAP_DRUSH,
    'arguments' => array(
      'name' => dt('User name'),
      'mail' => dt('E-mail address'),
      'role' => dt('Role'),
    ),
  );
  $items['provision-liftoff_variables'] = array(
    'description' => 'Set variables on site.',
    'bootstrap' => DRUSH_BOOTSTRAP_DRUSH,
    'arguments' => array(
      'sitename' => dt('Site name'),
      'lat' => dt('Lat'),
      'lng' => dt('Long'),
    ),
  );
  return $items;
}

/**
 * Map values of site node into command line arguments.
 */
function drush_provision_site_add_user_pre_hosting_task($task) {
  
  $task =& drush_get_context('HOSTING_TASK');
  if ($task->ref->type == 'site' && ($task->task_type == 'add_user' || $task->task_type == 'liftoff_variables')) {
    $task->args = $task->task_args;
  }

}


/**
 * Implements drush_hook_COMMAND().
 */
function drush_provision_site_add_user_provision_add_user($name, $mail, $role) {
  drush_log(dt('Start add user command for '.$name), 'ok');

  provision_backend_invoke(d()->name, 'user-create', array($name), array('mail' => $mail));
  provision_backend_invoke(d()->name, 'user-add-role', array($role, $name));
  
drush_log(dt('Completed add user command for '.$name), 'ok');
}



/**
 * Implements drush_hook_COMMAND().
 */
function drush_provision_site_add_user_provision_liftoff_variables($sitename, $lat, $lng) {
  drush_log(dt('Start site_vset command for'), 'ok');
  
  $vars = array(
    'sitename' => 'site_name',
    'lat' => 'helm_civic_map_lat',
    'lng' => 'helm_civic_map_lng'
  );
  foreach ($vars as $key=>$target) {
    if (!empty(${$key})) { 
      provision_backend_invoke(str_replace('-', '', d()->name), 'vset', array($target, ${$key}));
    }
  }

}

