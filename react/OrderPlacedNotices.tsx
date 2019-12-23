import React, { Fragment, FC } from 'react'
import { FormattedMessage } from 'react-intl'
import { FormattedDate, ButtonLink } from 'vtex.order-details'

import Price from './components/Payment/FormattedPrice'
import { parseBankInvoiceUrl, getPaymentGroupFromOrder } from './utils'
import { useOrderGroup } from './components/OrderGroupContext'
import styles from './styles.css'

const Notices: FC = () => {
  const { orders, totalDeliveryParcels, totalPickUpParcels } = useOrderGroup()
  const numOrders = orders.length
  const isSplitOrder = numOrders > 1
  const [bankInvoice] = orders
    .map(getPaymentGroupFromOrder)
    .filter(order => !!order.url)

  const hasBankInvoice = bankInvoice != null
  const hasDelivery = totalDeliveryParcels.length > 0
  const hasPickUp = totalPickUpParcels.length > 0
  const listItems = [
    !hasBankInvoice && (
      <FormattedMessage id="store/warnings.payment.approval" />
    ),
    hasDelivery && <FormattedMessage id="store/warnings.delivery.time" />,
    hasDelivery && <FormattedMessage id="store/warnings.delivery.tracking" />,
    hasPickUp && <FormattedMessage id="store/warnings.pickup.time" />,
    isSplitOrder && (
      <FormattedMessage
        id="store/warnings.order.split"
        values={{ numOrders }}
      />
    ),
    hasBankInvoice && (
      <FormattedMessage
        id="store/warnings.payment.bankInvoice.approval"
        values={{
          paymentSystemName: bankInvoice.paymentSystemName,
        }}
      />
    ),
    hasBankInvoice && (
      <Fragment>
        {bankInvoice.dueDate ? (
          <FormattedMessage
            id="store/warnings.payment.bankInvoice.value.duedate"
            values={{
              paymentDueDate: (
                <strong>
                  <FormattedDate date={bankInvoice.dueDate} style="short" />
                </strong>
              ),
              paymentValue: (
                <strong>
                  <Price value={bankInvoice.value} />
                </strong>
              ),
            }}
          />
        ) : (
          <FormattedMessage
            id="store/warnings.payment.bankInvoice.value"
            values={{
              paymentValue: (
                <strong>
                  <Price value={bankInvoice.value} />
                </strong>
              ),
            }}
          />
        )}
        <div className="mt4">
          {bankInvoice.url && (
            <ButtonLink
              to={parseBankInvoiceUrl(bankInvoice.url)}
              variation="primary"
              openNewWindow
            >
              <FormattedMessage
                id="store/payments.bankinvoice.print"
                values={{
                  paymentSystemName: bankInvoice.paymentSystemName,
                }}
              />
            </ButtonLink>
          )}
        </div>
      </Fragment>
    ),
  ].filter(Boolean)

  return (
    <section data-testid="notices-section" className="mt7 mb9">
      <ul className="list ma0 pl0 t-body bg-muted-5 tc-m lh-copy">
        {listItems.map((item, index) => (
          <li
            className={`${styles.noticeListItem} pv6 w-80-ns w-90 center c-on-base b--muted-4 bb`}
            key={index}
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Notices