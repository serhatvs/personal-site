import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Boxes,
  Cloud,
  Cpu,
  Database,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Send,
  Sparkles,
  Twitter,
  Waypoints,
  Workflow,
  X,
  createIcons,
} from 'lucide'

const icons = {
  'arrow-right': ArrowRight,
  'arrow-up-right': ArrowUpRight,
  'badge-check': BadgeCheck,
  boxes: Boxes,
  cloud: Cloud,
  cpu: Cpu,
  database: Database,
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
  'map-pin': MapPin,
  menu: Menu,
  send: Send,
  sparkles: Sparkles,
  twitter: Twitter,
  waypoints: Waypoints,
  workflow: Workflow,
  x: X,
}

export function initIcons(root = document) {
  createIcons({
    icons,
    root,
    attrs: {
      class: 'lucide-icon',
      'stroke-width': 1.75,
    },
  })
}
