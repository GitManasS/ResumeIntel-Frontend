import { createSlice } from '@reduxjs/toolkit';
import { login, fetchMe, logout } from '../auth/authSlice';
import { getOrganizationId, isSuperAdmin } from '../../utils/roles';

const STORAGE_KEY = 'selectedOrganizationId';

const readStored = () => localStorage.getItem(STORAGE_KEY) || null;

const orgSlice = createSlice({
  name: 'org',
  initialState: {
    selectedOrganizationId: readStored(),
    selectedOrganizationName: null,
    selectedOrganizationSlug: null,
  },
  reducers: {
    setSelectedOrganization: (state, action) => {
      const { id, name, slug } = action.payload;
      state.selectedOrganizationId = id || null;
      state.selectedOrganizationName = name || null;
      state.selectedOrganizationSlug = slug || null;
      if (id) localStorage.setItem(STORAGE_KEY, id);
      else localStorage.removeItem(STORAGE_KEY);
    },
    clearSelectedOrganization: (state) => {
      state.selectedOrganizationId = null;
      state.selectedOrganizationName = null;
      state.selectedOrganizationSlug = null;
      localStorage.removeItem(STORAGE_KEY);
    },
  },
  extraReducers: (builder) => {
    const syncOrgFromUser = (state, user) => {
      if (isSuperAdmin(user)) return;
      const orgId = getOrganizationId(user);
      if (orgId) {
        state.selectedOrganizationId = orgId;
        state.selectedOrganizationName = user.organization?.name || null;
        state.selectedOrganizationSlug = user.organization?.slug || null;
        localStorage.setItem(STORAGE_KEY, orgId);
      }
    };

    builder
      .addCase(login.fulfilled, (state, action) => syncOrgFromUser(state, action.payload))
      .addCase(fetchMe.fulfilled, (state, action) => syncOrgFromUser(state, action.payload))
      .addCase(logout.fulfilled, (state) => {
        state.selectedOrganizationId = null;
        state.selectedOrganizationName = null;
        state.selectedOrganizationSlug = null;
        localStorage.removeItem(STORAGE_KEY);
      });
  },
});

export const { setSelectedOrganization, clearSelectedOrganization } = orgSlice.actions;
export default orgSlice.reducer;
