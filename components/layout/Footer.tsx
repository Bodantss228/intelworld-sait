export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-20">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold mb-3">
              <span className="text-primary">Intel</span>
              <span className="text-white">World</span>
            </h3>
            <p className="text-gray-400 mb-4 max-w-md">
              Юбилейный 5-й сезон. Тема "What If..." - исследование альтернативных реальностей вселенной IntelWorld.
            </p>
            <p className="text-sm text-gray-500">
              Ванилла+ сервер на Fabric 1.21.x
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-primary">Документы</h4>
            <ul className="space-y-2">
              <li>
                <a href="/docs/offer" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Договор-оферта
                </a>
              </li>
              <li>
                <a href="/docs/privacy" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Политика конфиденциальности
                </a>
              </li>
              <li>
                <a href="/docs/payment" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Порядок оплаты
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-primary">Свяжитесь с нами</h4>
            <p className="text-sm text-gray-400 mb-4">
              <a href="mailto:help@intelworld.ru" className="hover:text-primary transition-colors">
                help@intelworld.ru
              </a>
            </p>
            <div className="flex flex-col gap-2">
              <p className="text-xs text-gray-500">Способы оплаты:</p>
              <div className="flex gap-3 text-sm text-gray-400">
                <span>Т-Банк</span>
                <span>•</span>
                <span>Сбербанк</span>
                <span>•</span>
                <span>Альфа-Банк</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6">
          <p className="text-gray-500 text-sm mb-2">
            &copy; 2026 IntelWorld. Все права защищены.
          </p>
          <p className="text-gray-600 text-xs">
            ИП СИДОРОВ БОГДАН САНЫЧ (ИНН 694267522849 ОГРНИП 123456789098765)
          </p>
        </div>
      </div>
    </footer>
  );
}
