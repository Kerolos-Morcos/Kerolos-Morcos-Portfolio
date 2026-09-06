// Editorial summaries grounded in projects.js. Omit unverified responsibilities,
// auth mechanisms, personal challenges, decisions, lessons, and metrics.
const text = (en, ar) => ({ en, ar });
export const caseStudies = {
  'mission-car-users': {
    role: text('Full-Stack development', 'تطوير Full-Stack'),
    problem: text('Bring fleet management, vehicle reservations, and trip requests into one web application.', 'جمع إدارة الأسطول وحجز السيارات وطلبات الرحلات في تطبيق ويب واحد.'),
    solution: text('A Vue.js interface connected to a Node.js / Express.js backend and MySQL data layer.', 'واجهة Vue.js متصلة بخدمات Node.js وExpress.js وقاعدة بيانات MySQL.'),
    architecture: [text('Vue.js interface', 'واجهة Vue.js'), text('Node.js / Express.js services', 'خدمات Node.js / Express.js'), text('MySQL data', 'بيانات MySQL')],
    features: [text('Fleet management', 'إدارة الأسطول'), text('Vehicle reservations', 'حجز السيارات'), text('Trip requests and operations', 'طلبات الرحلات والعمليات')],
    result: text('A deployed fleet and reservations application. Access to internal screens requires an authorized account.', 'تطبيق منشور لإدارة الأسطول والحجوزات. تتطلب الشاشات الداخلية حسابًا مصرحًا له بالدخول.'),
    stackNotes: [text('Vue.js — application interface', 'Vue.js — واجهة التطبيق'), text('Node.js / Express.js — backend services', 'Node.js / Express.js — خدمات الخادم'), text('MySQL — relational application data', 'MySQL — بيانات التطبيق العلائقية')],
  },
  'fresh-cart': {
    role: text('Frontend development', 'تطوير الواجهة'),
    problem: text('Connect product discovery, cart and wishlist management, and checkout in a responsive shopping experience.', 'ربط استكشاف المنتجات والسلة والمفضلة وإتمام الطلبات في تجربة تسوق متجاوبة.'),
    solution: text('A Vue.js storefront with Pinia for client state and Axios for REST API integration.', 'متجر باستخدام Vue.js مع Pinia لإدارة حالة الواجهة وAxios للتكامل مع REST APIs.'),
    architecture: [text('Vue.js storefront', 'متجر Vue.js'), text('Pinia client state', 'حالة الواجهة عبر Pinia'), text('Axios / REST APIs', 'Axios / REST APIs')],
    features: [text('Product browsing', 'تصفح المنتجات'), text('Cart and wishlist', 'السلة والمفضلة'), text('Checkout flow', 'خطوات إتمام الطلب')],
    result: text('A deployed shopping frontend with a public source repository.', 'واجهة متجر منشورة مع مستودع كود متاح للمراجعة.'),
    stackNotes: [text('Vue.js — storefront components', 'Vue.js — مكونات المتجر'), text('Pinia — shared client state', 'Pinia — حالة مشتركة للواجهة'), text('Axios — API requests', 'Axios — طلبات API')],
  },
  adasah: {
    role: text('Frontend development', 'تطوير الواجهة'),
    problem: text('Make photography articles and learning resources easy to browse by category.', 'تسهيل تصفح مقالات التصوير والموارد التعليمية حسب التصنيف.'),
    solution: text('A Vue.js publication interface using Vue Router, Bootstrap, and Vite.', 'واجهة محتوى باستخدام Vue.js وVue Router وBootstrap وVite.'),
    architecture: [text('Vue.js pages', 'صفحات Vue.js'), text('Vue Router navigation', 'التنقل عبر Vue Router'), text('Articles and categories', 'المقالات والتصنيفات')],
    features: [text('Photography articles', 'مقالات التصوير'), text('Learning resources', 'موارد تعليمية'), text('Category browsing', 'التصفح حسب التصنيف')],
    result: text('A live photography platform with public source code.', 'منصة تصوير منشورة وكود مصدر متاح للمراجعة.'),
    stackNotes: [text('Vue Router — page navigation', 'Vue Router — التنقل بين الصفحات'), text('Bootstrap — responsive presentation', 'Bootstrap — عرض متجاوب'), text('Vite — build tooling', 'Vite — أدوات البناء')],
  },
  'bookly-app': {
    previewNote: text('Illustrative cover — not an application screenshot.', 'غلاف توضيحي — وليس لقطة من التطبيق.'),
    role: text('Mobile development', 'تطوير تطبيق موبايل'),
    problem: text('Organize book discovery, details, and favorites into a mobile application.', 'تنظيم استكشاف الكتب وتفاصيلها والمفضلة داخل تطبيق موبايل.'),
    solution: text('A Flutter and Dart application organized with Clean Architecture and Cubit state management.', 'تطبيق Flutter وDart منظم باستخدام Clean Architecture وإدارة الحالة عبر Cubit.'),
    features: [text('Browse books', 'تصفح الكتب'), text('Read book details', 'قراءة تفاصيل الكتب'), text('Save favorites', 'حفظ المفضلة')],
    stackNotes: [text('Flutter / Dart — mobile interface', 'Flutter / Dart — واجهة الموبايل'), text('Cubit — application state', 'Cubit — حالة التطبيق'), text('Clean Architecture — separation of responsibilities', 'Clean Architecture — فصل المسؤوليات')],
    result: text('A mobile project available to review on GitHub.', 'مشروع موبايل متاح للمراجعة على GitHub.'),
  },
};
