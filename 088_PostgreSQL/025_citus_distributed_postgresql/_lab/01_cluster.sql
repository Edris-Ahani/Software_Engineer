\set ON_ERROR_STOP on

-- Enable Citus on both workers before running this file on the coordinator.
CREATE EXTENSION IF NOT EXISTS citus;

SELECT citus_set_coordinator_host('coordinator', 5432);
SELECT citus_add_node('worker1', 5432);
SELECT citus_add_node('worker2', 5432);

SELECT version();
SELECT citus_version();
SELECT * FROM citus_get_active_worker_nodes();
