// Main export file for the icon system

// Export all types
export * from './types'

// Export the registry and utilities
export { 
  iconRegistry, 
  iconMap, 
  iconsByCategory, 
  searchIcons,
  type IconName 
} from './icon-registry'

// Export categorized icons
export * from './categories/navigation'
export * from './categories/action'
export * from './categories/status'
export * from './categories/user'
export * from './categories/education'
export * from './categories/communication'
export * from './categories/file'
export * from './categories/interface'
export * from './categories/social'

// Re-export all icons from lucide-react through our registry
// This allows for a gradual migration from direct lucide imports
export {
  // Navigation
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  ArrowLeft, ArrowRight, ArrowUp, ArrowDown,
  Menu, X, Home, Search, MoreHorizontal, MoreVertical,
  
  // Action
  Plus, Trash, Edit, Copy, Download, Upload, Save,
  Shuffle, RefreshCw, RotateCw, Play, Pause, Square,
  Settings, Filter, Sort, Move, Maximize, Minimize,
  LogOut, LogIn, Share, Send,
  
  // Status
  Check, CheckCircle, AlertCircle, AlertTriangle,
  Info, HelpCircle, XCircle, Clock, Loader,
  Star, Heart, Eye, EyeOff, Lock, Unlock,
  Shield, ShieldCheck, Zap, TrendingUp, TrendingDown,
  
  // User
  User, Users, UserPlus, UserMinus, UserCheck, UserX,
  Contact, PersonStanding, Baby, Accessibility,
  
  // Education
  BookOpen, Book, BookMarked, GraduationCap, Award,
  Trophy, Medal, Brain, Lightbulb, Sparkles,
  Target, Rocket, Microscope, Calculator, Compass,
  PenTool, Pencil,
  
  // Communication
  Mail, MessageSquare, MessageCircle, MessagesSquare,
  Phone, PhoneCall, Video, Mic, MicOff,
  Volume2, VolumeX, Bell, BellOff, Inbox,
  AtSign, Hash,
  
  // File
  File, FileText, FileImage, FileVideo, FileAudio,
  FileCode, FileArchive, FilePlus, FileMinus,
  FileCheck, FileX, Folder, FolderOpen, FolderPlus,
  Paperclip, Archive,
  
  // Interface
  Grid, List, LayoutGrid, LayoutList, Sidebar,
  PanelLeft, PanelRight, Maximize2, Minimize2,
  Expand, Shrink, Sliders, ToggleLeft, ToggleRight,
  Palette, Layers, Package, Box, Calendar, CalendarDays,
  BarChart3, PieChart, Activity, CreditCard, DollarSign,
  Percent, Link, ExternalLink, Anchor, Command,
  Terminal, Code, Keyboard, Mouse, Monitor,
  Smartphone, Tablet, Watch, Cpu, HardDrive,
  Wifi, WifiOff, Bluetooth, Cast, Airplay,
  Cloud, CloudDownload, CloudUpload, Database,
  Server, Globe, Map, MapPin, Navigation,
  
  // Social
  Github, Twitter, Facebook, Instagram, Linkedin,
  Youtube, Twitch, Chrome, Figma, Slack,
  Trello, Dribbble, Codepen
} from 'lucide-react'