'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';

import TrustMeter from '@/components/shared/Review/TrustMeter';
import { OutlineBtn, Button } from '@/components/shared/Forms/Buttons/Buttons';
import {
  FileInput,
  TextArea,
  Input,
  Select,
} from '@/components/shared/Forms/Inputs/Inputs';
import ConfirmDialog from '@/components/shared/confirm';
import ToggleCollapse from '@/components/shared/Seller/ToggleCollapse';
import Skeleton from '@/components/skeleton/skeleton';
import { itemData } from '@/constants/demoAPI';
import { IUserSettings, ISeller } from '@/constants/types';
import { sellerPrompt } from '@/constants/placeholders';
import { fetchSellerRegistration, registerSeller } from '@/services/sellerApi';
import { fetchUserSettings } from '@/services/userSettingsApi';

import { AppContext } from '../../../../../context/AppContextProvider';
import logger from '../../../../../logger.config.mjs';

const SellerRegistrationForm = () => {
  const HEADER = 'mb-5 font-bold text-lg md:text-2xl';
  const SUBHEADER = 'font-bold mb-2';

  const t = useTranslations();
  const placeholderSeller = itemData.seller;

  const [formData, setFormData] = useState({
    itemsForSale: '',
    sellerName: '',
    sellerType: 'Pioneer',
    sellerDescription: '',
    sellerAddress: '',
  });
  const [dbSeller, setDbSeller] = useState<ISeller | null>(null);
  const [userSettings, setUserSettings] = useState<IUserSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [files, setFiles] = useState<File[]>([]);
  const [previewImage, setPreviewImage] = useState<string[]>([]);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const { currentUser, autoLoginUser } = useContext(AppContext);

  useEffect(() => {
    if (!currentUser) {
      logger.info("User not logged in; attempting auto-login..");
      autoLoginUser();
    }

    const getSellerData = async () => {
      try {
        const data = await fetchSellerRegistration();
        if (data) {
          logger.info('Fetched seller data successfully:', { data });
          setDbSeller(data);
        } else {
          logger.warn('Seller not found.');
          setDbSeller(null);
        }
      } catch (error) {
        logger.error('Error fetching seller data:', { error });
        setError('Error fetching seller data.');
      } finally {
        setLoading(false);
      }
    };

    const getUserSettings = async () => {
      const settings = await fetchUserSettings();
      if (settings) {
        logger.info('Fetched user settings successfully:', {settings});
        setUserSettings(settings);
      } else {
        logger.info('User settings not found.');
        setUserSettings(null);
      }
    };

    getSellerData();
    getUserSettings();
  }, [currentUser]);

  const defaultSellerName = currentUser? currentUser?.user_name : '';
  // Initialize formData with dbSeller values if available
  useEffect(() => {
    if (dbSeller) {
      setFormData({
        sellerName: dbSeller.name || defaultSellerName,
        sellerDescription: dbSeller.description || '',
        sellerAddress: dbSeller.address || '',
        itemsForSale: dbSeller.sale_items || '',
        sellerType: dbSeller.seller_type || '',
      });
    }
  }, [dbSeller]);

  useEffect(() => {
    const {
      itemsForSale,
      sellerName,
      sellerType,
      sellerAddress
    } = formData;
    setIsFormValid(
      !!(
        itemsForSale &&
        sellerName &&
        sellerType &&
        sellerAddress
      ),
    );
  }, [formData]);

  // function preview image upload
  useEffect(() => {
    if (files.length === 0) return;
    const objectUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewImage(objectUrls);
    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
    
    // enable or disable save button based on form inputs
    const isFormFilled = Object.values(formData).some(v => v !== '');
    setIsSaveEnabled(isFormFilled);
  };

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      setFiles(Array.from(selectedFiles));
      logger.info('Images selected for upload:', { selectedFiles });
    }
  };

  // Function to save data to the database
  const handleSave = async () => {  
    // check if user is authenticated and form is valid
    if (!currentUser) {
      logger.warn('Form submission failed: User not authenticated.');
      return toast.error(t('SCREEN.SELLER_REGISTRATION.VALIDATION.REGISTRATION_FAILED_USER_NOT_AUTHENTICATED'));            
    }
    
    const sellCenter = JSON.parse(localStorage.getItem('mapCenter') as string);
    logger.info('Saving form data:', { formData, sellCenter });

    const regForm = {
      name: formData.sellerName,
      description: formData.sellerDescription,
      address: formData.sellerAddress,
      sale_items: formData.itemsForSale,
      seller_type: formData.sellerType,
    } as {
      name: string;
      description: string;
      address: string;
      sale_items: string;
      seller_type: string;
      sell_map_center?: {
        type: 'Point';
        coordinates: [number, number];
      };
    };  

    // Add sell_map_center field only if sellCenter is available
    if (sellCenter) {
      regForm.sell_map_center = {
        type: 'Point' as const,
        coordinates: [sellCenter[0], sellCenter[1]] as [number, number]
      };
    }; 
    console.log('registration form', regForm);

    try {
      const data = await registerSeller(regForm);
      setDbSeller(data.seller);
      if (data.seller) {
        toast.success(t('SCREEN.SELLER_REGISTRATION.VALIDATION.SUCCESSFUL_REGISTRATION_SUBMISSION'));
        logger.info('Seller registration saved successfully:', { data });
      }
    } catch (error) {
      logger.error('Error saving seller registration:', { error });
    }
  }

  const translatedSellerTypeOptions = [
    {
      value: 'Pioneer',
      name: t('SCREEN.SELLER_REGISTRATION.SELLER_TYPE.SELLER_TYPE_OPTIONS.PIONEER'),
    },
    {
      value: 'CurrentlyNotSelling',
      name: t('SCREEN.SELLER_REGISTRATION.SELLER_TYPE.SELLER_TYPE_OPTIONS.CURRENTLY_NOT_SELLING'),
    },
    {
      value: 'TestSeller',
      name: t('SCREEN.SELLER_REGISTRATION.SELLER_TYPE.SELLER_TYPE_OPTIONS.TEST_SELLER'),
    },
    {
      value: 'Other',
      name: t('SCREEN.SELLER_REGISTRATION.SELLER_TYPE.SELLER_TYPE_OPTIONS.OTHER'),
    },
  ];

  if (loading) {
    logger.info('Loading Seller Registration Form.');
    return (
      <Skeleton type='seller_registration' />
    );
  }

  return (
    <>
      <div className="w-full md:w-[500px] md:mx-auto p-4">
        <h1 className={HEADER}>
          {t('SCREEN.SELLER_REGISTRATION.SELLER_REGISTRATION_HEADER')}
        </h1>

        <div className="mb-4">
          <h2 className={SUBHEADER}>
            {t('SCREEN.SELLER_REGISTRATION.SELLER_SALE_ITEMS_LABEL')}
          </h2>
          <div className="mb-2">
            <TextArea
              name="itemsForSale"
              placeholder={sellerPrompt.sale_items}
              value={formData.itemsForSale}
              onChange={handleChange}
              styles={{ height: '200px' }}
            />
          </div>
        </div>
        <Link href="/map-center">
          <Button
            label={t('SCREEN.SELLER_REGISTRATION.SELLER_SELL_CENTER')}
            styles={{
              color: '#ffc153',
              height: '40px',
              padding: '10px',
              marginLeft: 'auto',
            }}
          />
        </Link>
        <div className="mb-4 mt-3 ml-auto w-min">
          <Button
            label={t('SHARED.SAVE')}
            disabled={!isSaveEnabled}
            styles={{
              color: '#ffc153',
              height: '40px',
              padding: '10px 15px',
            }}
            onClick={handleSave}
          />
        </div>
        <ToggleCollapse
          header={t('SCREEN.SELLER_REGISTRATION.REVIEWS_SUMMARY_LABEL')}>
          <TrustMeter ratings={dbSeller ? dbSeller.trust_meter_rating : placeholderSeller.trust_meter_rating} />
          <div className="flex items-center justify-between mt-3">
            <p className="text-sm">
              {t('SCREEN.BUY_FROM_SELLER.REVIEWS_SCORE_MESSAGE', {
                seller_review_rating: dbSeller ? dbSeller.trust_meter_rating : placeholderSeller.trust_meter_rating,
              })}
            </p>
            <Link href={dbSeller ? `/seller/reviews/${dbSeller.seller_id}` : '#'}>
              <OutlineBtn
                disabled={!currentUser}
                label={t('SHARED.CHECK_REVIEWS')}
              />
            </Link>
          </div>
        </ToggleCollapse>
        <ToggleCollapse
          header={t('SCREEN.BUY_FROM_SELLER.SELLER_CONTACT_DETAILS_LABEL')}>
          <div className="text-sm mb-3">
            <span className="font-bold">
              {t('SCREEN.BUY_FROM_SELLER.SELLER_PI_ID_LABEL') + ': '}
            </span>
            <span>{dbSeller ? dbSeller.name : ''}</span>
          </div>
          <div className="text-sm mb-3">
            <span className="font-bold">
              {t('SCREEN.BUY_FROM_SELLER.SELLER_PHONE_LABEL') + ': '}
            </span>
            <span>{userSettings ? userSettings.phone_number : ""}</span>
          </div>
          <div className="text-sm mb-3">
            <span className="font-bold">
              {t('SCREEN.BUY_FROM_SELLER.SELLER_EMAIL_LABEL') + ': '}
            </span>
            <span>{ userSettings ? userSettings.email : ""}</span>
          </div>
        </ToggleCollapse>
        <ToggleCollapse header={t('SCREEN.SELLER_REGISTRATION.SELLER_SETTINGS_LABEL')}>
          <div className="mb-4">
            <Input
              label={t('SCREEN.SELLER_REGISTRATION.SELLER_NAME')}
              name="sellerName"
              placeholder={sellerPrompt.name}
              type="text"
              value={formData.sellerName}
              onChange={handleChange}
            />

            <Select
              label={t('SCREEN.SELLER_REGISTRATION.SELLER_TYPE.SELLER_TYPE_LABEL')}
              name="sellerType"
              value={formData.sellerType}
              onChange={handleChange}
              options={translatedSellerTypeOptions}
            />

            <TextArea
              label={t('SCREEN.SELLER_REGISTRATION.SELLER_DETAILS')}
              name="sellerDescription"
              placeholder={sellerPrompt.description}
              value={formData.sellerDescription}
              onChange={handleChange}
            />

            <TextArea
              label={t('SCREEN.SELLER_REGISTRATION.SELLER_ADDRESS_LOCATION_LABEL')}
              name="sellerAddress"
              placeholder={sellerPrompt.address}
              value={formData.sellerAddress}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <FileInput
              label={t('SHARED.PHOTO.UPLOAD_PHOTO_LABEL')}
              images={[]}
              handleAddImages={handleAddImages}
            />
            {previewImage && (
              <div className="mt-2">
                <p className="text-sm text-zinc-600">{previewImage}</p>
              </div>
            )}
          </div>
          <div className="mb-4 mt-3 ml-auto w-min">
            <Button
              label={t('SHARED.SAVE')}
              disabled={!isSaveEnabled}
              styles={{
                color: '#ffc153',
                height: '40px',
                padding: '10px 15px',
              }}
              onClick={handleSave}
            />
          </div>
        </ToggleCollapse>

        <ConfirmDialog
          show={showConfirmDialog}
          onClose={() => setShowConfirmDialog(false)}
          onConfirm={setShowConfirmDialog}
          message={t('SHARED.CONFIRM_DIALOG')}
          url={linkUrl}
        />
      </div>
    </>
  );
};

export default SellerRegistrationForm;
