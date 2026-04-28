export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-20">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold mb-3">
              <span className="text-primary">Intell</span>
              <span className="text-white">World</span>
            </h3>
            <p className="text-gray-400 mb-4 max-w-md">
              Юбилейный 5-й сезон. Тема "What If..." - исследование альтернативных реальностей вселенной IntellWorld.
            </p>
            <p className="text-sm text-gray-500">
              Почти ванилла 1.21.8
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-primary">Телеграм каналы</h4>
            <a
              href="https://t.me/+qlRaO6spWoBlY2Fi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-primary hover:bg-primary/90 text-black font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Присоединиться к каналу
            </a>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-primary">Свяжитесь с нами</h4>
            <div className="flex flex-col gap-3 mb-4">
              <a href="https://t.me/bodantss" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors text-sm">
                @bodantss
              </a>
              <a href="https://t.me/photonxxl" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors text-sm">
                @photonxxl
              </a>
            </div>
            <div className="grid grid-cols-2 items-center gap-4 pt-4 lg:grid-cols-4">
              <a href="https://www.tinkoff.ru/rm/r_xOjSxJqqyY.etEoRxJAiF/bmrNY25088" target="_blank" rel="noopener noreferrer">
                <img
                  width="74"
                  height="24"
                  className="mx-auto h-10 w-auto rounded-xl bg-white p-2 hover:opacity-80 transition-opacity"
                  src="/img/payment/tinkoff.svg"
                  alt="Т-Банк"
                />
              </a>
              <a href="https://www.tinkoff.ru/rm/r_xOjSxJqqyY.etEoRxJAiF/bmrNY25088" target="_blank" rel="noopener noreferrer">
                <img
                  width="90"
                  height="56"
                  className="mx-auto h-14 w-auto hover:opacity-80 transition-opacity"
                  src="/img/payment/visa.svg"
                  alt="VISA"
                />
              </a>
              <a href="https://www.tinkoff.ru/rm/r_xOjSxJqqyY.etEoRxJAiF/bmrNY25088" target="_blank" rel="noopener noreferrer">
                <img
                  width="53"
                  height="16"
                  className="mx-auto h-8 w-auto rounded-xl bg-white p-2 hover:opacity-80 transition-opacity"
                  src="/img/payment/mir.svg"
                  alt="Мир"
                />
              </a>
              <a href="https://www.tinkoff.ru/rm/r_xOjSxJqqyY.etEoRxJAiF/bmrNY25088" target="_blank" rel="noopener noreferrer">
                <img
                  width="56"
                  height="40"
                  className="mx-auto h-10 w-auto pl-3 hover:opacity-80 transition-opacity"
                  src="/img/payment/mastercard.svg"
                  alt="Mastercard"
                />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6">
          <p className="text-gray-500 text-sm mb-2">
            &copy; 2026 IntellWorld. Все права у админов.
          </p>
          <p className="text-gray-600 text-xs">
            НП СИДОРОВ БОГДАН САНЫЧ (ИНН 694267522849 ОГРНИП 123456789098765)
          </p>
        </div>
      </div>
    </footer>
  );
}
