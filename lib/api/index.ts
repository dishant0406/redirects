import type { RedirectType } from '../constants';
import axiosClient from '../helpers/axios/client';

import type { AxiosResponse } from 'axios';

type AddRedirectProps = {
  fromDomain: string;
  toDomain: string;
  redirectType: RedirectType;
  pathForwarding: boolean;
  queryForwarding: boolean;
};

/**
 * Adds a new redirect based on the provided properties.
 *
 * @param data - The properties required to create a new redirect.
 * @param data.fromDomain - The domain from which the redirect originates.
 * @param data.toDomain - The domain to which the redirect points.
 * @param data.redirectType - The type of redirect, either 'permanent' or 'temporary'.
 * @param data.pathForwarding - Indicates whether the path should be forwarded.
 * @param data.queryForwarding - Indicates whether the query parameters should be forwarded.
 *
 * @route /add-redirect
 */

export const addRedirect = async (data: AddRedirectProps): Promise<AxiosResponse> => {
  return axiosClient.post('/redirects/add-redirect', data);
};

/**
 * Verifies the status of a given domain by making a POST request to the `/redirects/verify-domain` endpoint.
 *
 * @param domain - The domain to be verified.
 * @returns A promise that resolves to an AxiosResponse containing the verification status.
 */
export const verifyStatus = async (domain: string): Promise<AxiosResponse> => {
  return axiosClient.post(`/redirects/verify-domain`, { domain });
};

type UpdateRedirectProps = {
  id: string;
  toDomain: string;
  redirectType: RedirectType;
  pathForwarding: boolean;
  queryForwarding: boolean;
};

/**
 * Updates an existing redirect based on the provided properties.
 *
 * @param data - The properties required to update an existing redirect.
 * @param data.id - The ID of the redirect to be updated.
 * @param data.toDomain - The new domain to which the redirect points.
 * @param data.redirectType - The type of redirect, either 'permanent' or 'temporary'.
 * @param data.pathForwarding - Indicates whether the path should be forwarded.
 * @param data.queryForwarding - Indicates whether the query parameters should be forwarded.
 *
 * @route /update-redirect
 */
export const updateRedirect = async (data: UpdateRedirectProps): Promise<AxiosResponse> => {
  return axiosClient.put(`/redirects/update/${data.id}`, data);
};

/**
 * Retrieves the redirects associated with the authenticated user.
 *
 * @returns A promise that resolves to an AxiosResponse containing the user's redirects.
 *
 * @route /redirects/get-redirects/me
 */
export const getUserRedirects = async (): Promise<AxiosResponse> => {
  return axiosClient.get('/redirects/get-redirects/me');
};

/**
 * Deletes an existing redirect based on the provided ID.
 *
 * @param id - The ID of the redirect to be deleted.
 * @returns A promise that resolves to an AxiosResponse confirming the deletion.
 *
 * @route /delete-redirect/:id
 */
export const deleteRedirect = async (id: string): Promise<AxiosResponse> => {
  return axiosClient.delete(`/redirects/delete-redirect/${id}`);
};
