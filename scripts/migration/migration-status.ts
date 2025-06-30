#!/usr/bin/env tsx

import { MigrationHelper } from './migration-help';

// Show migration status
const helper = new MigrationHelper();
helper.showStatus();