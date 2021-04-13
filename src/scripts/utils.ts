import { ResourceType } from 'src/types/resource';

export const getLabel = (item: Record<string, string | number>) => (item as ResourceType).link as string;
export const getValue = (item: Record<string, string | number>) => (item as ResourceType).id as number;
