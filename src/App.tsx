import { useState, useEffect, useMemo, useCallback } from 'react';
import { useQuery } from 'react-query';
import {
  Backdrop,
  Button,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  SwipeableDrawer,
  TextField,
  useMediaQuery,
} from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import cx from 'classnames';

import './reset.scss';
import styles from './style.module.scss';
import { getJPY, getProductJP, getProductTW } from './apis/apis';
import { ProductDetailJP } from './types/jp';
import { ProductDetailTW } from './types/tw';

const productNameFormatterJP = (name: string) => {
  const size = name.indexOf('（');
  return name.slice(0, size);
};
const productImageGetterJP = (product: ProductDetailJP | undefined) =>
  product ? Object.values(product.images.main)[0].image : undefined;
const productImageGetterTW = (product: ProductDetailTW | undefined) =>
  product ? `https://www.uniqlo.com/tw${product.mainPic}` : undefined;
const SEARCH_HISTORY_KEY = 'SEARCH_HISTORY_KEY';

function App() {
  const isMobile = useMediaQuery('(max-width:768px)');
  const [jpyCurrency, setJpyCurrency] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [productId, setProductId] = useState('');
  const [isLoadingJP, setIsLoadingJP] = useState(false);
  const [isLoadingTW, setIsLoadingTW] = useState(false);
  const [searchHistory, setSearchHistory] = useState<{ id: string; name: string }[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const { data: productDetailJP } = useQuery(
    ['productDetailJP', productId],
    async () => {
      setIsLoadingJP(true);
      try {
        const res = await getProductJP(productId);
        const productDetail = res?.result?.items[0];
        console.log('JP: ', productDetail);
        return productDetail;
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingJP(false);
      }
    },
    { enabled: productId.length > 0 }
  );
  const { data: productDetailTW } = useQuery(
    ['productDetailTW', productId],
    async () => {
      setIsLoadingTW(true);
      try {
        const res = await getProductTW(productId);
        const productDetail = res?.resp[1][0];
        console.log('TW: ', productDetail);
        if (productDetail) {
          setSearchHistory((prev) => [
            { id: productId, name: productDetail.name },
            ...prev.filter((item) => item.id !== productId),
          ]);
        }
        return productDetail;
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingTW(false);
      }
    },
    { enabled: productId.length > 0 }
  );

  const priceJP = useMemo(() => (productDetailJP ? productDetailJP.prices.base.value : ''), [productDetailJP]);
  const priceTW = useMemo(() => (productDetailTW ? productDetailTW.prices[0] : ''), [productDetailTW]);
  const productImage = useMemo(
    () => productImageGetterTW(productDetailTW) || productImageGetterJP(productDetailJP),
    [productDetailJP, productDetailTW]
  );

  const handleSubmit = (id: string) => {
    if (!id) return;
    setProductId(id);
  };

  const jpyToTwd = useCallback((jpy: number | string) => (Number(jpy) / jpyCurrency).toFixed(2), [jpyCurrency]);
  const twdToJpy = useCallback((twd: number | string) => (Number(twd) * jpyCurrency).toFixed(2), [jpyCurrency]);

  useEffect(() => {
    getJPY().then((res) => setJpyCurrency(res.rates.JPY || 1));
  }, []);

  useEffect(() => {
    const history = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(searchHistory));
  }, [searchHistory]);

  return (
    <div className={styles.container}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(searchInput);
        }}
        className={styles.form}
      >
        <TextField
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          size="small"
          InputProps={{
            style: { fontSize: '20px' },
            endAdornment: searchInput && (
              <IconButton onClick={() => setSearchInput('')} edge="end">
                <HighlightOffIcon />
              </IconButton>
            ),
          }}
        />
        <Button variant="outlined" type="submit" sx={{ fontSize: '16px' }}>
          查詢
        </Button>
      </form>
      <div className={styles.currency}>
        <p>{`1 臺幣 = ${jpyCurrency} 日幣`}</p>
        <p>{`1 日幣 = ${(1 / jpyCurrency).toFixed(2)} 臺幣`}</p>
      </div>
      <div className={styles.productDetail}>
        {productDetailTW ? (
          <>
            <div className={styles['productDetail__name']}>
              <p className={styles['productDetail__name--primary']}>{productDetailTW.name}</p>
              {productDetailJP && (
                <p className={styles['productDetail__name--secondary']}>
                  {productNameFormatterJP(productDetailJP.name)}
                </p>
              )}
            </div>
            {productImage && <img src={productImage} className={styles.productDetail__img} />}
          </>
        ) : (
          <>
            <div className={styles['productDetail__name']}>
              <p className={styles['productDetail__name--primary']}>{productDetailJP?.name}</p>
            </div>
            {productImage && <img src={productImage} className={styles.productDetail__img} />}
          </>
        )}
        <ul className={styles.list}>
          {productDetailJP ? (
            <li className={styles.list__item}>
              <div className={styles.list__item__title}>
                <a
                  href={`https://www.uniqlo.com/jp/ja/products/${productDetailJP.productId}/00`}
                  target="_blank"
                  rel="noreferrer"
                >
                  日本
                </a>
              </div>
              <div>日幣：{priceJP}</div>
              <div>臺幣：{jpyToTwd(priceJP)}</div>
            </li>
          ) : (
            productDetailTW &&
            !isLoadingJP && <li className={cx(styles.list__item, styles.notFound)}>日本找不到此產品</li>
          )}
          {productDetailTW ? (
            <li className={styles.list__item}>
              <div className={styles.list__item__title}>
                <a
                  href={`https://www.uniqlo.com/tw/zh_TW/product-detail.html?productCode=${productDetailTW.productCode}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  臺灣
                </a>
              </div>
              <div>日幣：{twdToJpy(priceTW)}</div>
              <div>臺幣：{priceTW}</div>
            </li>
          ) : (
            productDetailJP &&
            !isLoadingTW && <li className={cx(styles.list__item, styles.notFound)}>台灣找不到此產品</li>
          )}
        </ul>
        {productDetailJP && productDetailTW && (
          <div className={styles.difference}>
            <div className={styles.difference__title}>差額</div>
            <div>日幣：{Math.abs(Number(priceJP) - Number(twdToJpy(priceTW))).toFixed(2)}</div>
            <div>臺幣：{Math.abs(Number(priceTW) - Number(jpyToTwd(priceJP))).toFixed(2)}</div>
          </div>
        )}
      </div>
      {isMobile ? (
        <div className={styles.historyToggle} onClick={() => setIsHistoryOpen(true)}>
          <Button
            variant="contained"
            sx={{
              minWidth: '1.5em',
              padding: '10px',
              lineHeight: 1.2,
              borderLeft: 'none',
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
            }}
          >
            搜<br />尋<br />紀<br />錄
          </Button>
        </div>
      ) : (
        <div className={styles.historyDesktop}>
          <List>
            {searchHistory.map((product) => (
              <ListItem key={product.id} disablePadding>
                <ListItemButton
                  onClick={() => {
                    setProductId(product.id);
                    setIsHistoryOpen(false);
                    setSearchInput(product.id);
                    handleSubmit(product.id);
                  }}
                >
                  <ListItemText
                    primaryTypographyProps={{
                      fontSize: '16px',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                    }}
                    primary={`${product.id} ${product.name}`}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </div>
      )}
      <SwipeableDrawer
        anchor="right"
        open={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onOpen={() => setIsHistoryOpen(true)}
        PaperProps={{
          sx: { maxWidth: '60%' },
        }}
      >
        <List>
          {searchHistory.map((product) => (
            <ListItem key={product.id} disablePadding>
              <ListItemButton
                onClick={() => {
                  setProductId(product.id);
                  setIsHistoryOpen(false);
                  setSearchInput(product.id);
                  handleSubmit(product.id);
                }}
              >
                <ListItemText
                  primaryTypographyProps={{
                    fontSize: '16px',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                  }}
                  primary={`${product.id} ${product.name}`}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </SwipeableDrawer>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoadingJP || isLoadingTW}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

export default App;
