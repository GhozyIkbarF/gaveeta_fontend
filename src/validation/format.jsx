
export const formatMoneyIDR = (num) => {
     const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
    });
    return formatter.format(num)
}

export const formatToIDR = (num) => {
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });
    return formatter.format(num);
  }
  
  export const formatCurrency = (num) => {
    if (typeof num !== 'number') return null;
    return num.toLocaleString('id-ID', {
      style: 'currency',
      currency: 'IDR'
    });
  }

  export const formatInputMoneyIDR = (num) => {
    if (num) {
    const regex = /\B(?=(\d{3})+(?!\d))/g;
    const newValue = num.replace(/\D/g, "").replace(/^0+/, "");
    return `Rp. ${newValue.replace(regex, ".")}`
    }
  };


  export const convertToIndonesianDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
  };
  

export const getDateToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dateToday = `${year}-${month}-${day}`;
    return dateToday
}

export const  getThisMonth = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const formattedDate = `${year}-${month}`;
  return formattedDate
}