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
