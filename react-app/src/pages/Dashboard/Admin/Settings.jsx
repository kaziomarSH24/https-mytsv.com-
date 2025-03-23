import { useState, useEffect } from 'react';
import axios from 'axios';
import { CiSearch } from "react-icons/ci";
import {
    FaCog, FaGlobe, FaPalette, FaSave, FaPhone,
    FaMapMarkerAlt, FaEnvelope, FaCheck,
    FaDesktop, FaMobile, FaTabletAlt, FaSpinner
} from "react-icons/fa";
import { toast } from 'react-toastify';

export default function Settings() {
    const [activeTab, setActiveTab] = useState('general');
    const [isDirty, setIsDirty] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [settings, setSettings] = useState({
        website_name: '',
        business_slogan: '',
        contact_email: '',
        support_phone: '',
        default_location: '',
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
        primary_color: '#DC2626'
    });
    const [previewDevice, setPreviewDevice] = useState('desktop');

    const tabs = [
        { id: 'general', icon: FaGlobe, label: 'General' },
        { id: 'appearance', icon: FaPalette, label: 'Appearance' }
    ];

    const presetColors = [
        '#EF4444', '#2563EB', '#059669', '#7C3AED', '#EA580C', '#0891B2'
    ];

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('Dashboard/Admin/Settings');

            setSettings(prev => ({
                ...prev,
                ...response.data
            }));
        } catch (error) {
            toast.error('Failed to load settings');
            console.error('Error loading settings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSettingChange = (name, value) => {
        setSettings(prev => ({
            ...prev,
            [name]: value
        }));
        setIsDirty(true);
    };


    const handleSave = async () => {
        try {
            setIsLoading(true);
            const settingsArray = Object.entries(settings).map(([name, value]) => ({
                name,
                value: value ?? ''
            }));

            await axios.post('/Dashboard/Admin/Settings', {
                settings: settingsArray
            });

            toast.success('Settings saved successfully');
            setIsDirty(false);
        } catch (error) {
            console.error('Error saving settings:', error);
            toast.error(error.response?.data?.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <h1 className="text-4xl font-medium flex items-center gap-3 text-gray-800">
                    <FaCog style={{ color: settings.primary_color }} />
                    Settings
                </h1>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                        <CiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-2xl border border-gray-200 py-3 pl-12 pr-4 outline-none focus:border-primary-light focus:ring-2 focus:ring-red-100 transition-all bg-white shadow-sm"
                            placeholder="Search settings..."
                        />
                    </div>
                    {isDirty && (
                        <button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-6 py-3 rounded-2xl transition-all shadow-sm hover:shadow text-white disabled:opacity-50"
                            style={{ backgroundColor: settings.primary_color }}
                        >
                            {isLoading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                            Save Changes
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                {/* Tabs */}
                <div className="flex gap-2 p-2 border-b overflow-x-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all whitespace-nowrap ${activeTab === tab.id ? 'font-medium' : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            style={{
                                backgroundColor: activeTab === tab.id ? `${settings.primary_color}15` : '',
                                color: activeTab === tab.id ? settings.primary_color : ''
                            }}
                        >
                            <tab.icon className="text-sm" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Settings Content */}
                <div className="p-6">
                    {isLoading && activeTab !== 'media' && (
                        <div className="flex justify-center items-center py-12">
                            <FaSpinner className="animate-spin text-2xl" style={{ color: settings.primary_color }} />
                        </div>
                    )}

                    {!isLoading && (
                        <>
                            {/* General Settings */}
                            {activeTab === 'general' && (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Basic Information */}
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-medium text-gray-800 mb-6">Basic Information</h2>
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="font-medium text-gray-700 flex items-center gap-2">
                                                    <FaGlobe className="text-gray-400" />
                                                    Website Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={settings.website_name}
                                                    onChange={(e) => handleSettingChange('website_name', e.target.value)}
                                                    className="w-full rounded-xl py-3 px-4 border border-gray-200 outline-none focus:border-primary-light focus:ring-2 focus:ring-red-100 transition-all"
                                                    placeholder="Your Website Name"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="font-medium text-gray-700">Business Slogan</label>
                                                <input
                                                    type="text"
                                                    value={settings.business_slogan}
                                                    onChange={(e) => handleSettingChange('business_slogan', e.target.value)}
                                                    className="w-full rounded-xl py-3 px-4 border border-gray-200 outline-none focus:border-primary-light focus:ring-2 focus:ring-red-100 transition-all"
                                                    placeholder="Your business slogan"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="font-medium text-gray-700 flex items-center gap-2">
                                                    <FaEnvelope className="text-gray-400" />
                                                    Contact Email
                                                </label>
                                                <input
                                                    type="email"
                                                    value={settings.contact_email}
                                                    onChange={(e) => handleSettingChange('contact_email', e.target.value)}
                                                    className="w-full rounded-xl py-3 px-4 border border-gray-200 outline-none focus:border-primary-light focus:ring-2 focus:ring-red-100 transition-all"
                                                    placeholder="contact@example.com"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="font-medium text-gray-700 flex items-center gap-2">
                                                    <FaPhone className="text-gray-400" />
                                                    Support Phone
                                                </label>
                                                <input
                                                    type="tel"
                                                    value={settings.support_phone}
                                                    onChange={(e) => handleSettingChange('support_phone', e.target.value)}
                                                    className="w-full rounded-xl py-3 px-4 border border-gray-200 outline-none focus:border-primary-light focus:ring-2 focus:ring-red-100 transition-all"
                                                    placeholder="+1 (555) 000-0000"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="font-medium text-gray-700 flex items-center gap-2">
                                                    <FaMapMarkerAlt className="text-gray-400" />
                                                    Default Location
                                                </label>
                                                <input
                                                    type="text"
                                                    value={settings.default_location}
                                                    onChange={(e) => handleSettingChange('default_location', e.target.value)}
                                                    className="w-full rounded-xl py-3 px-4 border border-gray-200 outline-none focus:border-primary-light focus:ring-2 focus:ring-red-100 transition-all"
                                                    placeholder="City, Country"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* SEO Settings */}
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-medium text-gray-800 mb-6">SEO Settings</h2>
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="font-medium text-gray-700">Meta Title</label>
                                                <input
                                                    type="text"
                                                    value={settings.meta_title}
                                                    onChange={(e) => handleSettingChange('meta_title', e.target.value)}
                                                    className="w-full rounded-xl py-3 px-4 border border-gray-200 outline-none focus:border-primary-light focus:ring-2 focus:ring-red-100 transition-all"
                                                    placeholder="Your Website Title"
                                                />
                                                <p className="text-sm text-gray-500">Recommended length: 50-60 characters</p>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="font-medium text-gray-700">Meta Description</label>
                                                <textarea
                                                    value={settings.meta_description}
                                                    onChange={(e) => handleSettingChange('meta_description', e.target.value)}
                                                    className="w-full rounded-xl py-3 px-4 border border-gray-200 outline-none focus:border-primary-light focus:ring-2 focus:ring-red-100 transition-all min-h-32"
                                                    placeholder="Brief description of your website..."
                                                />
                                                <p className="text-sm text-gray-500">Recommended length: 150-160 characters</p>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="font-medium text-gray-700">Meta Keywords</label>
                                                <input
                                                    type="text"
                                                    value={settings.meta_keywords}
                                                    onChange={(e) => handleSettingChange('meta_keywords', e.target.value)}
                                                    className="w-full rounded-xl py-3 px-4 border border-gray-200 outline-none focus:border-primary-light focus:ring-2 focus:ring-red-100 transition-all"
                                                    placeholder="keyword1, keyword2, keyword3"
                                                />
                                                <p className="text-sm text-gray-500">Separate keywords with commas</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Appearance Settings */}
                            {activeTab === 'appearance' && (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-medium text-gray-800 mb-6">Color Scheme</h2>
                                        <div className="space-y-6">
                                            <div className="space-y-4">
                                                <label className="font-medium text-gray-700">Primary Color</label>
                                                <div className="flex items-center gap-4">
                                                    <input
                                                        type="color"
                                                        value={settings.primary_color}
                                                        onChange={(e) => handleSettingChange('primary_color', e.target.value)}
                                                        className="w-16 h-16 rounded-lg cursor-pointer"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={settings.primary_color}
                                                        onChange={(e) => handleSettingChange('primary_color', e.target.value)}
                                                        className="w-32 rounded-xl py-3 px-4 border border-gray-200 outline-none focus:border-primary-light focus:ring-2 focus:ring-red-100 transition-all"
                                                        placeholder="#000000"
                                                    />
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {presetColors.map(color => (
                                                        <button
                                                            key={color}
                                                            onClick={() => handleSettingChange('primary_color', color)}
                                                            className="w-10 h-10 rounded-lg border-2 border-white shadow-sm hover:scale-110 transition-transform"
                                                            style={{ backgroundColor: color }}
                                                            aria-label={`Select color ${color}`}
                                                        >
                                                            {settings.primary_color === color && (
                                                                <FaCheck className="text-white m-auto" />
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="text-lg font-medium text-gray-800">Preview Device</h3>
                                            <div className="flex gap-4">
                                                {[
                                                    { id: 'desktop', icon: FaDesktop, label: 'Desktop' },
                                                    { id: 'tablet', icon: FaTabletAlt, label: 'Tablet' },
                                                    { id: 'mobile', icon: FaMobile, label: 'Mobile' }
                                                ].map(device => (
                                                    <button
                                                        key={device.id}
                                                        onClick={() => setPreviewDevice(device.id)}
                                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${previewDevice === device.id
                                                            ? 'bg-gray-100 text-gray-900'
                                                            : 'text-gray-600 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        <device.icon />
                                                        {device.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-medium text-gray-800 mb-6">Preview</h2>
                                        <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                                            {/* Preview content would go here */}
                                            <div className="text-center text-gray-500">
                                                Preview not available in demo
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
