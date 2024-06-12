import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

import { itemData } from '@/constants/demoAPI';
import TrustMeter from '@/components/seller/TrustMeter';
import { Button, OutlineBtn } from '../Forms/Buttons/Buttons';
import { useRouter } from 'next/navigation';

const MapMarkerPopup = () => {
  const t = useTranslations()
  const SUBHEADER = 'font-bold mb-2';
  const router = useRouter();

  return (
    <>
      <div className="max-w-sm rounded-md justify-center mx-auto z-20">
        {/* Seller Profile */}
        <div className="font-bold text-base mb-3">
          {itemData.seller.business}
          <span className="ps-2">({itemData.seller.ratings}/5.0)</span>
        </div>
        <div className="flex gap-2 items-center mb-2">
          <div className="w-[70px] h-[70px] min-w-[70px] min-h-[70px] relative">
            <Image
              alt="seller logo"
              src={itemData.seller.url}
              fill={true}
              className="rounded-xl m-0 my-auto"
            />
          </div>
          <div className="font-bold line-clamp-4">{itemData.seller.description}</div>
        </div>
        <div>
          <TrustMeter ratings={itemData.seller.ratings} />
        </div>

        {/* Items List */}
        <h2 className={`${SUBHEADER} text-base`}>{t('POPUP.MAP_MARKER.SELLER_SALE_ITEMS_FIELD')}</h2>
        <div className="seller_item_container mb-1 max-h-[200px] overflow-auto">
          <ul>
            {itemData.items.map((item) => (
              <div key={item.id} className="flex gap-2">
                <li>{item.name}</li>
                <li>{item.price}Pi</li>
              </div>
            ))}
          </ul>
        </div>
        <div className="font-bold m-3">{t('POPUP.MAP_MARKER.DISTANCE_MESSAGE')}</div>

        <div className="flex justify-between space-x-4 gap-2">
          <Button
            label={t('SHARED.BUY')}
            onClick={() => router.push('/seller/seller-item')}
            styles={{ width: '100%', padding: '6px' }}
          />
          <OutlineBtn
            label={t('SHARED.NAVIGATE')}
            onClick={() => router.push('/seller/seller-item')}
            styles={{ width: '100%', padding: '6px' }}
          />
        </div>
      </div>
    </>
  );
};

export default MapMarkerPopup;
