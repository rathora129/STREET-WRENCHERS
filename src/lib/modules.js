import { cache } from 'react';
import { MODULE_DEFINITIONS, MODULE_KEYS } from '@/data/modules';
import { getSettings } from './settings';

export { MODULE_DEFINITIONS, MODULE_KEYS };

export const MODULE_STATUS_LABELS = {
  ACTIVE: 'Active',
  COMING_SOON: 'Coming Soon',
  HIDDEN: 'Hidden',
  DRAFT: 'Draft',
};

export function isPubliclyActive(status) {
  return status === 'ACTIVE';
}

export function isVisibleInNavigation(status) {
  return status === 'ACTIVE' || status === 'COMING_SOON';
}

export const getModuleMap = cache(async () => {
  const settings = await getSettings();
  return settings.modules;
});

export async function getModule(key) {
  const modules = await getModuleMap();
  const definition = MODULE_DEFINITIONS[key];
  if (!definition) return null;
  const config = modules[key] || {};
  return { ...definition, ...config, status: config.status || 'HIDDEN' };
}

export async function getPublicModules() {
  const modules = await getModuleMap();
  return MODULE_KEYS.map((key) => ({
    ...MODULE_DEFINITIONS[key],
    ...modules[key],
    status: modules[key]?.status || 'HIDDEN',
  })).filter((module) => isVisibleInNavigation(module.status));
}

export async function getNavModules() {
  const modules = await getPublicModules();
  return modules.map((module) => ({
    label: module.navLabel,
    href: module.publicPath,
    status: module.status,
  }));
}

export async function assertModuleAccess(key) {
  const module = await getModule(key);
  if (!module || !isPubliclyActive(module.status)) return null;
  return module;
}
