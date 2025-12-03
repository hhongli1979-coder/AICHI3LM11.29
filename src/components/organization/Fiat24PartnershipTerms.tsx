import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Handshake, Calendar, ShieldCheck, Scales, Globe, FileText } from '@phosphor-icons/react';

export function Fiat24PartnershipTerms() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Handshake size={24} weight="duotone" className="text-primary" />
              </div>
              <div>
                <CardTitle>Fiat24 联合品牌合作条款</CardTitle>
                <CardDescription>与合作伙伴钱包提供商之间的合作协议</CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="gap-2">
              <Calendar size={14} weight="duotone" />
              生效日期: 2024年2月21日
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none dark:prose-invert">
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold border-b pb-2">
              <FileText size={20} weight="duotone" className="text-primary" />
              定义
            </div>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                <strong>Fiat24</strong>是 SR Saphirstein AG（"Saphirstein"）公司用于其数字服务的品牌名称，该公司根据瑞士法律在苏黎世注册成立，公司注册号为 CHE256.014.995。
              </p>
              <p>
                <strong>钱包提供商</strong>或合作伙伴钱包或简称合作伙伴是指提供数字钱包的法人实体（公司），用户可以使用这些数字钱包创建他们的 Fiat24 账户。
              </p>
              <p>以上每一方都是一个政党，它们共同组成各方。</p>
              <p>
                <strong>Fiat24 NFT</strong>是由 Saphirstein 独家发行的非同质化 ERC-721 数字代币。每个 NFT 都有一个唯一的 ID 号，并发送给 Fiat24 服务的一位最终用户。NFT ID（编号）用于识别最终用户在 Fiat24 的账户，并代表最终用户与 Saphirstein 之间的合约。
              </p>
              <p>
                <strong>知识产权</strong>是指世界任何地方存在的下列任何权利：所有专利、实用新型、发明权、植物品种权、版权及邻接权和相关权利、精神权利、外观设计权、半导体集成电路布图设计权、商标和服务标志、商号、标识、外观设计权、商誉以及就假冒或不正当竞争提起诉讼的权利、域名注册权、数据库权和保密信息权（包括专有技术）以及所有其他知识产权，无论是否已注册；注册上述任何权利的申请；申请续展或延期以及主张优先权的权利；以及任何类似或等效的权利。
              </p>
              <p>
                <strong>标志</strong>是指双方用于识别其公司、业务、产品、服务的图形和/或文本、图片、文字、符号、名称（可能采用特定字体和/或颜色），并且双方拥有该等图形和/或文本、图片、文字、符号、名称的知识产权。
              </p>
              <p>
                <strong>服务</strong>包括我们提供的所有产品、服务、内容、特性、技术或功能，以及所有相关的网站、应用程序（包括 Fiat24 Web 应用程序）和服务（包括网站和 API）。
              </p>
            </div>
          </section>

          <section className="space-y-4 mt-6">
            <div className="flex items-center gap-2 text-lg font-semibold border-b pb-2">
              <Globe size={20} weight="duotone" className="text-primary" />
              目的与协议
            </div>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                <strong>目的。</strong>本条款提供了一个框架，双方同意在此框架下合作开展其部分产品和服务的联合品牌推广项目。
              </p>
              <p>
                <strong>已签署协议。</strong>任何针对特定合作伙伴的附加条款必须另行以书面形式约定并由双方签署。本条款构成双方合作协议的组成部分。
              </p>
              <p>
                <strong>联合品牌合作。</strong>Fiat24和钱包提供商同意在双方共同用户使用的特定产品和服务（"联合品牌"产品）上使用双方的标识。钱包提供商特此确认，使用 Fiat24 服务的合同是 Saphirstein 与最终用户之间根据Fiat24 用户和客户条款及条件达成的双边协议。
              </p>
            </div>
          </section>

          <section className="space-y-4 mt-6">
            <div className="flex items-center gap-2 text-lg font-semibold border-b pb-2">
              <ShieldCheck size={20} weight="duotone" className="text-primary" />
              知识产权许可
            </div>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                为此，Fiat24 和钱包提供商相互授予对方一项非独占、不可转让且可撤销的许可，允许其使用各自徽标中的知识产权，以便将其应用于约定的产品和服务。双方特此声明，其是拟在合作范围内使用的图形和文字徽标的知识产权及其他适用法律权利的合法所有者。本许可仅涵盖约定的产品和服务。双方确认，其保留各自徽标的所有权利、所有权和权益，且本条款不向另一方转让任何所有权。
              </p>
            </div>
          </section>

          <section className="space-y-4 mt-6">
            <div className="flex items-center gap-2 text-lg font-semibold border-b pb-2">
              <FileText size={20} weight="duotone" className="text-primary" />
              产品和服务选择
            </div>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>上述联合品牌合作协议最初涵盖的产品和服务如下所示。双方可另行书面约定，对选择范围进行增减，此约定不影响本框架条款。</p>
              
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <p>
                  <strong>Fiat24 NFT 的联合品牌标识。</strong>任何由钱包提供商提供的钱包地址铸造的 Fiat24 账户标识 NFT，其视觉呈现都将包含双方的标志。即使本协议终止或 NFT 被转移到其他钱包，从钱包提供商钱包铸造的 NFT 的联合品牌标识也将永久保留。
                </p>
                <p>
                  <strong>卡片联名。</strong>根据上述方式，由钱包提供商提供的钱包地址生成账户 NFT 的用户，在特定条件下，Fiat24 将发行一张联名支付卡，该支付卡将印有双方的标志。即使本协议终止，此联名标识仍将永久有效。此发卡项目须经 VISA 或任何其他相关支付卡服务机构的独立批准，未经批准不得进行。
                </p>
                <p>
                  <strong>设计和位置。</strong>关于双方标识在选定产品和服务上的设计和位置的具体细节，将由双方另行以书面形式商定。
                </p>
                <p>
                  <strong>禁止使用。</strong>任何一方均不得以任何方式使用另一方的标识，如果该方式与另一方的品牌指南不符，或可能损害或贬低另一方的声誉，包括未经另一方事先书面同意，不得以任何方式修改或歪曲另一方的标识。
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4 mt-6">
            <div className="flex items-center gap-2 text-lg font-semibold border-b pb-2">
              <ShieldCheck size={20} weight="duotone" className="text-primary" />
              保密性与非排他性
            </div>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                <strong>保密性。</strong>双方承诺对因本协议而交换或获得的任何信息保密，特别是有关双方公司、员工、其他合作伙伴和客户的任何信息。
              </p>
              <p>
                <strong>非排他性。</strong>本条款中的任何内容均不应妨碍任何一方与任何第三方订立类似的联合品牌协议。
              </p>
            </div>
          </section>

          <section className="space-y-4 mt-6">
            <div className="flex items-center gap-2 text-lg font-semibold border-b pb-2">
              <Handshake size={20} weight="duotone" className="text-primary" />
              钱包提供商的义务
            </div>
            <div className="space-y-3 text-sm leading-relaxed">
              <ul className="list-disc list-inside space-y-2">
                <li>合作伙伴仅限于非托管钱包，也就是说，合作伙伴不代表最终用户持有私钥。最终用户应完全掌控资产处置。</li>
                <li>合作伙伴承诺告知合作伙伴钱包的用户，除 Fiat24 根据其定价系统收取的任何佣金或费用外，还可能对用户想要交易的金额征收任何扣款、费用、佣金或收费。</li>
                <li>此外，合作伙伴承诺真诚地向Fiat24提供与其法律结构、公司设立和业务相关的所有必要文件和信息。Fiat24保留要求合作伙伴提供其他文件和信息的权利。合作伙伴应在Fiat24提出要求后的10个工作日内，自愿或主动向Fiat24提供合理的补充文件。</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4 mt-6">
            <div className="flex items-center gap-2 text-lg font-semibold border-b pb-2">
              <Scales size={20} weight="duotone" className="text-primary" />
              责任限制
            </div>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>Fiat24对因联合品牌合作而导致的任何损失或损害，不承担对合作伙伴钱包提供商或合作伙伴钱包和/或服务用户的任何责任。尤其需要指出的是：</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Fiat24 对因不当或非法使用合作伙伴提供的任何图形和文本标识或品牌名称而导致的任何后果不承担责任。</li>
                <li>如果合作伙伴钱包提供商未能告知合作伙伴钱包和/或服务的用户，除 Fiat24 根据其定价系统收取的佣金外，还会对用户想要交易的金额征收任何扣款、费用、佣金或收费，由此造成的任何后果，Fiat24 概不负责。</li>
                <li>如果合作伙伴钱包提供商未能遵守下文第 16 条规定的限制，Fiat24 对此不承担任何责任。</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4 mt-6">
            <div className="flex items-center gap-2 text-lg font-semibold border-b pb-2">
              <FileText size={20} weight="duotone" className="text-primary" />
              宣传与出版物
            </div>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                <strong>宣传。</strong>合作伙伴不得在其网站的任何位置放置 Fiat24 的名称或公司信息（包括法定名称 SR Saphirstein、公司编号、地址等），并且未经 Fiat24 事先明确的书面许可，不得宣布此合作关系的存在和/或与之相关的任何细节（特别是但不限于有关联名卡的信息）。
              </p>
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <p><strong>出版物：</strong></p>
                <ul className="list-disc list-inside space-y-2">
                  <li>合作伙伴不得将 Fiat24 称为"银行"，而应使用"金融科技公司"、"金融服务提供商"、"瑞士银行法第 1b 条所指的机构"或其他双方约定的名称。如有疑问，合作伙伴应联系 Fiat24 以确认措辞。</li>
                  <li>合作伙伴不得在其关于 Fiat24 的出版物中包含任何行动号召、行动邀请、命令或指示。信息内容仅限于对 Fiat24 服务的描述性介绍。</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-4 mt-6">
            <div className="flex items-center gap-2 text-lg font-semibold border-b pb-2">
              <ShieldCheck size={20} weight="duotone" className="text-primary" />
              赔偿与条款变更
            </div>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                <strong>赔偿。</strong>各方同意赔偿、维护并使另一方及其高级职员、董事、雇员和代理人免受因一方违反本协议使用另一方标识而引起的或与之相关的任何索赔、损害、责任、成本和费用。
              </p>
              <p>
                <strong>不受 Saphirstein用户和客户条款及条件的约束。</strong>Saphirstein 保留修改其向最终用户提供的 Fiat24 服务条款（例如定价）的权利，除非这些条款已与钱包提供商另行签订合同。
              </p>
              <p>
                <strong>条款可分割性。</strong>如果本条款中的一项或多项无效或违法，其余条款仍然有效。
              </p>
              <p>
                <strong>书面变更。</strong>本条款及双方签署的任何文件构成双方就本协议标的达成的完整理解，且仅能以书面形式（包括电子邮件）进行变更、例外或偏离。任何一方的标识如发生变更，且该变更影响虚拟卡上的显示，亦须以书面形式通知。
              </p>
            </div>
          </section>

          <section className="space-y-4 mt-6">
            <div className="flex items-center gap-2 text-lg font-semibold border-b pb-2">
              <Calendar size={20} weight="duotone" className="text-primary" />
              期限与终止
            </div>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                <strong>期限。</strong>本条款自双方书面约定之日起生效，初始有效期为二十四 (24) 个月。期满后，合作关系将按季度（三个月）自动续期，并可在每个新季度开始时取消。
              </p>
              <p>
                <strong>通知期。</strong>在本条款有效期内，任何一方均可于每月月底以书面形式提前三个月发出通知，终止合伙关系。
              </p>
            </div>
          </section>

          <section className="space-y-4 mt-6">
            <div className="flex items-center gap-2 text-lg font-semibold border-b pb-2">
              <Scales size={20} weight="duotone" className="text-primary" />
              适用法律和管辖权
            </div>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                本协议、其标的物以及各方在本协议项下的各自权利和义务均受瑞士苏黎世法律管辖并按其解释。因本协议引起或与本协议有关的任何争议均应由瑞士苏黎世法院专属管辖。
              </p>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
