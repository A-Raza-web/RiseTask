import { useState, useEffect } from "react";
import axios from "axios";
import { FaMoon, FaBell, FaSave, FaGlobe, FaCog, FaSun, FaUndo, FaCheck } from "react-icons/fa";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import "./Settings.css";
import { useSnackbar } from "../contexts/SnackbarContext";
import { useConfirmDialog } from "../hooks/useConfirmDialog"; 

const API_URL = "https://rise-task-server.vercel.app/api/settings"; // Backend ka route
const DEFAULT_SETTINGS = {
  notifications: true,
  darkMode: false,
  autoSave: true,
  language: "en",
  timezone: "UTC",
};

const Settings = ({ setDarkMode, token }) => {
  const authToken = token || localStorage.getItem("token");
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const [initialSettings, setInitialSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const { showSnackbar } = useSnackbar();
  const { showConfirmDialog, ConfirmDialog } = useConfirmDialog();

  // sidebar active section
  const [activeSection, setActiveSection] = useState('general');
  const sectionTitles = {
    general: 'General Settings',
    notifications: 'Notifications',
    reset: 'Reset Settings'
  };

  const handleMenuKey = (section) => (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveSection(section);
    }
  };


  // âœ… 1. Load settings from backend when component mounts
  useEffect(() => {
    const fetchSettings = async () => {
      if (!authToken) {
        setLoading(false);
        showSnackbar("Please sign in to view settings", "error");
        return;
      }

      try {
        const res = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const nextSettings = { ...DEFAULT_SETTINGS, ...(res.data?.settings || res.data) };
        setSettings(nextSettings); // jo backend se mila usay state me daal do
        setInitialSettings(nextSettings);
        if (setDarkMode) {
          setDarkMode(nextSettings.darkMode);
        }
      } catch (err) {
        console.error("Error fetching settings:", err.response?.data || err.message);
        showSnackbar('Failed to load settings', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [authToken, setDarkMode, showSnackbar]);

  // âœ… 2. Update local state only (persist on Save Settings)
  const handleSettingChange = (setting, value) => {
    const updatedSettings = { ...settings, [setting]: value };
    setSettings(updatedSettings);

    if (setting === "darkMode" && setDarkMode) {
      setDarkMode(value);
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !settings.darkMode;
    handleSettingChange("darkMode", newDarkMode);
  };

  // Full save of current settings
  const saveSettings = async () => {
    if (!authToken) {
      showSnackbar("Please sign in to save settings", "error");
      return;
    }

    try {
      await axios.put(API_URL, settings, {
        headers: { Authorization: `Bearer ${authToken}`, "Content-Type": "application/json" },
      });
      setInitialSettings(settings);
      showSnackbar('Settings saved', 'success');
    } catch (err) {
      console.error('Error saving settings:', err.response?.data || err.message);
      showSnackbar('Failed to save settings', 'error');
    }
  };

  const resetToDefaults = () => {
    showConfirmDialog(async () => {
      const defaults = {
        ...DEFAULT_SETTINGS,
      };
      setSettings(defaults);
      if (setDarkMode) setDarkMode(defaults.darkMode);
      showSnackbar("Defaults applied. Click Save Settings to persist.", "success");
    }, {
      title: 'Reset settings',
      message: 'This will restore default settings. Are you sure?',
      confirmText: 'Reset',
      cancelText: 'Cancel'
    });
  };

  const isDirty = () => JSON.stringify(settings) !== JSON.stringify(initialSettings);


  const orange = "#fd7e14";

  const flagMap = { en: 'ðŸ‡¬ðŸ‡§', ur: 'ðŸ‡µðŸ‡°', es: 'ðŸ‡ªðŸ‡¸' };


  const languageOptions = [
    { code: "en", label: "English" },
    { code: "ur", label: "Urdu" },
    { code: "es", label: "Spanish" },
  ];



  const iconStyle = (enabled) => ({ 
    color: enabled ? orange : "gray",
    opacity: enabled ? 1 : 0.6,
    transition: "0.3s",
  });

  const switchStyle = (enabled) => ({
    backgroundColor: enabled ? orange : "#e9ecef",
    borderColor: enabled ? orange : "#ccc",
  });

  if (loading) return <p>Loading settings...</p>;

  return (
    <div className="container mt-4 settings-page">
      <div className="row">
        <div className="col-md-3">
          <aside className="settings-sidebar p-3">
            <div className="sidebar-header mb-3 d-flex align-items-center">
              <div className="me-2 sidebar-avatar"> 
                <FaCog style={{color: orange}} />
              </div>
              <div>
                <div className="fw-bold">Settings</div>
                <div className="small text-muted">Manage preferences</div>
              </div>
            </div>
            <ul className="list-unstyled sidebar-menu">
              <li
                role="button"
                tabIndex={0}
                aria-current={activeSection === 'general' ? 'true' : undefined}
                onClick={() => setActiveSection('general')}
                onKeyDown={handleMenuKey('general')}
                className={`menu-item d-flex align-items-center py-2 px-2 ${activeSection === 'general' ? 'active' : ''}`}
              >
                <FaCog className="me-2" /> <span>General</span>
              </li>

              <li
                role="button"
                tabIndex={0}
                aria-current={activeSection === 'notifications' ? 'true' : undefined}
                onClick={() => setActiveSection('notifications')}
                onKeyDown={handleMenuKey('notifications')}
                className={`menu-item d-flex align-items-center py-2 px-2 ${activeSection === 'notifications' ? 'active' : ''}`}
              >
                <FaBell className="me-2" /> <span>Notifications</span>
              </li>

              <li
                role="button"
                tabIndex={0}
                aria-current={activeSection === 'reset' ? 'true' : undefined}
                onClick={() => setActiveSection('reset')}
                onKeyDown={handleMenuKey('reset')}
                className={`menu-item d-flex align-items-center py-2 px-2 mt-2 ${activeSection === 'reset' ? 'active' : ''}`}
              >
                <FaUndo className="me-2" /> <span>Reset</span>
              </li>
            </ul>
          </aside>
        </div>
        <div className="col-md-9">
          <div className="card shadow-sm border-0 settings-card">
            <div className="card-header">
              <h5 className="mb-0"><FaCog className="me-2" /> {sectionTitles[activeSection]}</h5>
              <div className="text-muted small">Manage your preferences and app settings</div>
            </div>
            <div className="card-body p-4">{activeSection === "general" && (<>


              {/* ðŸŒ™ Dark Mode */}
              <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
                <div>
                  <label className="form-label mb-0">
                    {settings.darkMode ? (
                      <FaMoon className="me-2" style={iconStyle(true)} />
                    ) : (
                      <FaSun className="me-2" style={{ color: orange }} />
                    )}
                    <strong>{settings.darkMode ? "Dark Mode" : "Light Mode"}</strong>
                  </label>
                  <p id="darkModeDesc" className="text-muted small mb-0">
                    {settings.darkMode ? "Dark theme is enabled" : "Light mode is enabled"}
                  </p>
                </div>
                <div className="form-check form-switch">
                  <input
                    id="darkModeToggle"
                    aria-label="Toggle dark mode"
                    aria-describedby="darkModeDesc"
                    className="form-check-input"
                    type="checkbox"
                    checked={settings.darkMode}
                    onChange={toggleDarkMode}
                    style={switchStyle(settings.darkMode)}
                  />
                </div>
              </div>

              {/* ðŸ”” Notifications */}
              <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
                <div>
                  <label className="form-label mb-0">
                    <FaBell className="me-2" style={iconStyle(settings.notifications)} />
                    <strong>Notifications</strong>
                  </label>
                  <p id="notificationsDesc" className="text-muted small mb-0">Enable system notifications</p>
                </div>
                <div className="form-check form-switch">
                  <input
                    id="notificationsToggle"
                    aria-label="Toggle notifications"
                    aria-describedby="notificationsDesc"
                    className="form-check-input"
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={(e) =>
                      handleSettingChange("notifications", e.target.checked)
                    }
                    style={switchStyle(settings.notifications)}
                  />
                </div>
              </div>

              {/* ðŸ’¾ Auto Save */}
              <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
                <div>
                  <label className="form-label mb-0">
                    <FaSave className="me-2" style={iconStyle(settings.autoSave)} />
                    <strong>Auto Save</strong>
                  </label>
                  <p id="autoSaveDesc" className="text-muted small mb-0">Automatically save your changes</p>
                </div>
                <div className="form-check form-switch">
                  <input
                    id="autoSaveToggle"
                    aria-label="Toggle auto save"
                    aria-describedby="autoSaveDesc"
                    className="form-check-input"
                    type="checkbox"
                    checked={settings.autoSave}
                    onChange={(e) =>
                      handleSettingChange("autoSave", e.target.checked)
                    }
                    style={switchStyle(settings.autoSave)}
                  />
                </div>
              </div>

              {/* ðŸŒ Language */}
              <div className="row mb-3">
                <div className="col-md-12">
                  <div className="languageWidth d-flex align-items-center justify-content-between mb-3">
                    <div>
                      <label className="form-label mb-0">
                        <FaGlobe className="me-2" style={iconStyle(true)} />
                        <strong>Language</strong>
                      </label>
                      <p className="text-muted small mb-0">Select your preferred language</p>
                    </div>
                    <div style={{ minWidth: 220, marginLeft: 10 }} className="settings-autocomplete language">
                      <Autocomplete
                        id="language-autocomplete"
                        options={languageOptions}
                        getOptionLabel={(opt) => opt.label}
                        value={languageOptions.find(o => o.code === settings.language) || null}
                        isOptionEqualToValue={(option, val) => option?.code === val?.code}
                        onChange={(e, val) => handleSettingChange('language', val?.code || '')}
                        disablePortal
                        PaperComponent={(paperProps) => <div {...paperProps} style={{ minWidth: '100%' }} />}
                        PopperProps={{ placement: 'bottom-start', modifiers: [{ name: 'offset', options: { offset: [0, 8] } }, { name: 'computeStyles', options: { adaptive: false } }] }}
                        renderOption={(props, option, { selected }) => (
                          <li {...props} className="autocomplete-option d-flex align-items-center">
                            <div className="option-icon d-flex align-items-center justify-content-center me-3">
                              <span className="flag">{flagMap[option.code] || 'ðŸŒ'}</span>
                            </div>
                            <div className="option-content">
                              <div className="option-label">{option.label}</div>
                              <div className="option-sub text-muted small">({option.code})</div>
                            </div>
                            <div className="ms-auto d-flex align-items-center">
                              <div className="option-meta text-muted small">{option.code}</div>
                              {selected && <FaCheck className="ms-2 text-warning check-icon" />}
                            </div>
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            variant="outlined"
                            placeholder="Select language"
                            aria-label="Select language"
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <InputAdornment position="start">
                                  <FaGlobe style={{ color: orange }} />
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="settings-actions d-flex justify-content-end gap-2 mt-4">
                <button className="btn btn-outline-secondary" onClick={resetToDefaults} aria-label="Reset settings">
                  <FaUndo className="me-1" /> Reset
                </button>
                <button
                  className="btn btn-primary"
                  onClick={saveSettings}
                  disabled={!isDirty()}
                  aria-disabled={!isDirty()}
                  aria-label="Save settings"
                >
                  <FaSave className="me-1" /> Save Settings
                </button>
              </div>

            </>)}

            {activeSection === 'notifications' && (
              <div>
                <h6>Notifications</h6>
                <p className="text-muted">Control notification preferences.</p>
                <div className="d-flex align-items-center justify-content-between mb-3 pt-2 pb-2 border-bottom">
                  <div>
                    <label className="form-label mb-0"><FaBell className="me-2" style={iconStyle(settings.notifications)} /><strong>Notifications</strong></label>
                    <p className="text-muted small mb-0">Enable system notifications</p>
                  </div>
                  <div className="form-check form-switch">
                    <input id="notificationsToggle2" aria-label="Toggle notifications" className="form-check-input" type="checkbox" checked={settings.notifications} onChange={(e)=>handleSettingChange("notifications", e.target.checked)} style={switchStyle(settings.notifications)} />
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'reset' && (
              <div>
                <h6>Reset Settings</h6>
                <p className="text-muted">Reset all settings to their default values.</p>
                <button className="btn btn-outline-secondary" onClick={resetToDefaults}><FaUndo className="me-1" /> Reset to defaults</button>
              </div>
            )}

            </div>
          </div>
        </div>
      </div>
      <ConfirmDialog />
    </div>
  );
};

export default Settings;

