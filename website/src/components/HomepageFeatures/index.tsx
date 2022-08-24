import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'User sessions',
    Svg: require('@site/static/img/undraw_security_re_a2rk.svg').default,
    description: (
      <>
        Sessions tied to existing wallet addresses of the user
      </>
    ),
  },
  {
    title: 'Granular permissions',
    Svg: require('@site/static/img/undraw_authentication_re_svpt.svg').default,
    description: (
      <>
        Secure data access control using object capabilities
      </>
    ),
  },
  {
    title: 'Multi-chain support',
    Svg: require('@site/static/img/undraw_duplicate_re_d39g.svg').default,
    description: (
      <>
        Accounts and wallets are not limited to Ethereum
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
