import { Fragment, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { Dialog, Popover, Tab, Transition } from '@headlessui/react'
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

import LogoHeader from 'assets/logo.svg'
import DeskLampHeader from 'assets/desklampheader.jpg'
import PenHeader from 'assets/penheader.jpg'
import AccessoryHeader from 'assets/accesoryheader.jpg'
import HighlightHeader from 'assets/highlightheader.jpg'

import NewArrivalPopularHeader from 'assets/newarrivalpopularheader.jpg'
import PenPopularHeader from 'assets/penpopularheader.jpg'
import AccessoryPopularHeader from 'assets/accessorypopularheader.jpg'
import HighlightPopularHeader from 'assets/highlightpopularheader.jpg'

import { logout } from 'store/reducer/user'
import fetchAxios from 'utils/axios'

const navigation = {
  categories: [
    {
      name: 'New Arrival',
      featured: [
        {
          name: 'New Arrivals',
          href: `/categories/Desk%20Lamp?id=47`,
          imageSrc: DeskLampHeader,
          imageAlt: 'Models sitting in desk working with desklamp.',
        },
        {
          name: 'Basic',
          href: `/categories/Pen?id=48`,
          imageSrc: PenHeader,
          imageAlt: 'Pen and notebook with decoration on top of wood desk.',
        },
        {
          name: 'Accessories',
          href: `/collections/Accessories%20Collection?id=5`,
          imageSrc: AccessoryHeader,
          imageAlt: 'Assortment of stationaries on top of white desk.',
        },
        {
          name: 'Highlight',
          href: `/products/all`,
          imageSrc: HighlightHeader,
          imageAlt: 'Model sitting and typing on computer placed on top of working desk.',
        },
      ],
    },
    {
      name: 'Popular',
      featured: [
        {
          name: 'New Arrivals',
          href: `/collections/Creative%20Collection?id=4`,
          imageSrc: NewArrivalPopularHeader,
          imageAlt: 'Model writing on personal diary while sitting on work chair and desk.',
        },
        {
          name: 'Basic',
          href: '/products/all',
          imageSrc: PenPopularHeader,
          imageAlt: 'Golden pen high class stationery highlighted on top of white desk.',
        },
        {
          name: 'Working',
          href: `/categories/Work%20Chairs?id=47`,
          imageSrc: AccessoryPopularHeader,
          imageAlt:
            'Chair with table and notebook arrangement.',
        },
        {
          name: 'Highlight',
          href: `/categories/Work%20Desks?id=49`,
          imageSrc: HighlightPopularHeader,
          imageAlt: 'Model sitting on chair facing desk with computer and calculator placed on top of desk.',
        },
      ],
    },
  ],

}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}


const Header = ({ }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { userId, username, expire } = useSelector((state) => state.userData);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleSearch = () => {
    setIsSearchActive((prev) => !prev);
  };

  const handleSearch = async () => {
    try {
      const response = await fetchAxios.get(`/products/name/search?name=${searchTerm}`);
      console.log('response', response)

      if (response?.data && response?.data?.length > 0) {
        const product = response?.data?.[0];
        window.location.href = `/products/detail/${product.id}`;
      } else {
        console.log('No products found');
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const totalQuantity = useSelector((state) =>
  state.cartData.items.reduce((total, item) => total + item.quantity, 0)
);

  // Function to check if the session has expired
  const isSessionExpired = () => {
    const currentTime = Date.now();
    return currentTime > expire;
  };

  useEffect(() => {
    // Check if the session has expired on component mount or when `expire` changes
    if (expire && isSessionExpired()) {
      dispatch(logout());
      navigate('/');
    }
  }, [expire, dispatch, navigate]);

  return (
     <div className="bg-white">
      {/* Mobile menu */}
      <Transition.Root show={mobileMenuOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setMobileMenuOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
                <div className="flex px-4 pb-2 pt-5">
                  <button
                    type="button"
                    className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Links */}
                <Tab.Group as="div" className="mt-2">
                  <div className="border-b border-gray-200">
                    <Tab.List className="-mb-px flex space-x-8 px-4">
                      {navigation.categories.map((category) => (
                        <Tab
                          key={category.name}
                          className={({ selected }) =>
                            classNames(
                              selected ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-900',
                              'flex-1 whitespace-nowrap border-b-2 px-1 py-4 text-base font-medium'
                            )
                          }
                        >
                          {category.name}
                        </Tab>
                      ))}
                    </Tab.List>
                  </div>
                  <Tab.Panels as={Fragment}>
                    {navigation.categories.map((category) => (
                      <Tab.Panel key={category.name} className="space-y-12 px-4 py-6">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-10">
                          {category.featured.map((item) => (
                            <div key={item.name} className="group relative">
                              <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-md bg-gray-100 group-hover:opacity-75">
                                <img src={item.imageSrc} alt={item.imageAlt} className="object-cover object-center" />
                              </div>
                              <Link to={item.href} className="mt-6 block text-sm font-medium text-red-400">
                                <span className="absolute inset-0 z-10" aria-hidden="true" />
                                {item.name}
                              </Link>
                              <p aria-hidden="true" className="mt-1 text-xs text-gray-500">
                                Shop now
                              </p>
                            </div>
                          ))}
                        </div>
                      </Tab.Panel>
                    ))}
                  </Tab.Panels>
                </Tab.Group>

                <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                  <div className="flow-root">
                    <a href="#" className="-m-2 block p-2 font-medium text-gray-900">
                      Create an account
                    </a>
                  </div>
                  <div className="flow-root">
                    <a href="#" className="-m-2 block p-2 font-medium text-gray-900">
                      Sign in
                    </a>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Navigation */}
      <header className="relative z-10">
        <nav aria-label="Top">
          {/* Secondary navigation */}
          <div className="bg-blue-400 backdrop-blur-md backdrop-filter">
            <div className="mx-auto max-w-8xl px-4 sm:px-4 lg:px-8">
              <div>
                <div className="flex h-16 items-center justify-between">
                  {/* Logo (lg+) */}
                  <div className="flex lg:flex-1 items-center">
                    <Link className="flex items center gap-3" to="/">
                      <img
                        className="h-9 w-auto"
                        src={LogoHeader}
                        alt=""
                      />
                      <span className="text-2xl font-bold text-yellow-300">WorKIT</span>
                    </Link>

                 {/* Search Icon and Input */}
                  <div className="relative flex items-center ml-2">
                    <button
                      onClick={toggleSearch}
                      className="p-2 text-white"
                      aria-label="Search"
                    >
                      <MagnifyingGlassIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                    
                    {isSearchActive && (
                        // <div className="flex items-center ml-2">
                            <div
      className="absolute left-0 top-[70%] mt-2 flex items-center bg-white p-2 border border-gray-300 rounded-md shadow-md"
      style={{ minWidth: '250px' }} // Set a minimum width for the input container
    >
                          <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
                            placeholder="Search Product..."
                          />
                          <button
                            onClick={handleSearch}
                            className="ml-2 p-2 bg-yellow-500 text-white rounded"
                          >
                            Search
                          </button>
                        </div>
                      )}
                  </div>
                  </div>

                  <div className="hidden h-full lg:flex">
                    {/* Flyout menus */}
                    <Popover.Group className="inset-x-0 bottom-0 px-4">
                      <div className="flex h-full justify-center space-x-14">
                        {navigation.categories.map((category) => (
                          <Popover key={category.name} className="flex">
                            {({ open, close }) => (
                              <>
                                <div className="relative flex">
                                  <Popover.Button className="relative z-10 flex items-center justify-center text-xl text-white font-bold hover:text-gray-400 transition-colors duration-200 ease-out">
                                    {category.name}
                                    <span
                                      className={classNames(
                                        open ? 'bg-white' : '',
                                        'absolute inset-x-0 -bottom-px h-0.5 transition duration-200 ease-out'
                                      )}
                                      aria-hidden="true"
                                    />
                                  </Popover.Button>
                                </div>

                                <Transition
                                  as={Fragment}
                                  enter="transition ease-out duration-200"
                                  enterFrom="opacity-0"
                                  enterTo="opacity-100"
                                  leave="transition ease-in duration-150"
                                  leaveFrom="opacity-100"
                                  leaveTo="opacity-0"
                                >
                                  <Popover.Panel className="absolute inset-x-0 top-full text-sm text-gray-500">
                                    {/* Presentational element used to render the bottom shadow */}
                                    <div className="absolute inset-0 top-1/2 bg-white shadow" aria-hidden="true" />

                                    <div className="relative bg-white">
                                      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                                        <div className="grid grid-cols-4 gap-x-8 gap-y-10 py-16">
                                          {category.featured.map((item) => (
                                            <div key={item.name} className="group relative">
                                              <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-md bg-gray-100 group-hover:opacity-75">
                                                <img
                                                  src={item.imageSrc}
                                                  alt={item.imageAlt}
                                                  className="object-cover object-center"
                                                />
                                              </div>
                                              <Link 
                                                to={item.href} 
                                                className="mt-4 block font-bold text-red-500"
                                                onClick={() => close()}
                                                >
                                                  <span className="absolute inset-0 z-10" aria-hidden="true" />
                                                  {item.name}
                                              </Link>
                                              <p aria-hidden="true" className="mt-1">
                                                Shop now
                                              </p>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </Popover.Panel>
                                </Transition>
                              </>
                            )}
                          </Popover>
                        ))}
                      </div>
                    </Popover.Group>
                  </div>

                  {/* Mobile menu and search (lg-) */}
                  <div className="flex flex-1 items-center lg:hidden">
                    <button type="button" className="-ml-2 p-2 text-white" onClick={() => setMobileMenuOpen(true)}>
                      <span className="sr-only">Open menu</span>
                      <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    </button>

                    {/* Search */}
                    {/* <a href="#" className="ml-2 p-2 text-white">
                      <span className="sr-only">Search</span>
                      <MagnifyingGlassIcon className="h-6 w-6" aria-hidden="true" />
                    </a> */}
                  </div>

                  <div className="flex flex-1 items-center justify-end">
                    {userId? (
                       <div className="flex items-center gap-2">
                       {/* Render "Orders" link if the user is logged in */}
                       <Link 
                         to={`orders/history/${userId}`} 
                         className="text-sm font-medium text-white lg:block lg:mr-4"
                       >
                         Orders
                       </Link>
             
                       {/* Logout Link styled like Orders */}
                       <Link
                         to="/"
                         className="text-sm font-medium text-white lg:block lg:mr-4"
                         onClick={(e) => {
                           e.preventDefault(); // Prevent immediate navigation
                           dispatch(logout());
                           navigate('/');
                         }}
                       >
                         Logout
                       </Link>
                     </div>
                    
                    ) : (
                      // Render sign-in, login, and create account links if the user is not logged in
                      <>
                        <Link to={"/login"} className="p-2 text-white lg:hidden">
                          <span className="text-xs font-medium text-gray-900">Login</span>
                        </Link>
                        <Link to={"/login"} className="hidden text-sm font-medium text-gray-900 lg:block lg:mr-4">
                          Login
                        </Link>

                        <Link href={"/register"} className="p-2 text-white lg:hidden">
                          <span className="text-xs font-medium text-gray-900">Sign Up</span>
                        </Link>
                        <Link href={"/register"} className="hidden text-sm font-medium text-gray-900 lg:block">
                          Create Account
                        </Link>
                      </>
                    )}
                        {/* Cart */}
                        <div className="ml-4 flow-root lg:ml-4">
                          <Link 
                          className="group -m-2 flex items-center p-2"
                          to={`/cart`} 
                          >
                            <ShoppingBagIcon className="h-6 w-6 flex-shrink-0 text-gray-900 font-bold" aria-hidden="true" />
                            <span className="ml-2 text-sm font-bold text-gray-900">{totalQuantity}</span>
                            <span className="sr-only">items in cart, view bag</span>
                          </Link>
                        </div>
                      </div>
                    
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Header;